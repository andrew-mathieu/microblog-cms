"use client";
import {
  FormEvent,
  useState,
  useMemo,
  useEffect,
  TextareaHTMLAttributes,
} from "react";
import { useRouter } from "next/navigation";
import PocketBase from "pocketbase";
import type * as pb from "@/types/pocketbase-types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { customAlphabet } from "nanoid";
import { marked } from "marked";
import Textarea from "@/components/ui/Textarea";
const pocketbase = new PocketBase(process.env.POCKETBASE_URL);

type ErrorType = {
  status: number;
  message: string;
};

export default function NewArticle() {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<pb.PostsResponse[]>();
  const nanoid = customAlphabet("1234567890", 16);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const checkIfAdmin = async () => {
    const adm = await pocketbase.authStore.isAdmin;
    if (adm) {
      setIsAdmin(true);
    }
  };

  const fetchData = async () => {
    try {
      const data: pb.PostsResponse[] = await pocketbase
        .collection("posts")
        .getFullList();
      if (data && data.length > 0) {
        const sortedPosts = data
          .map((post) => ({
            ...post,
            createdTimestamp: new Date(post.created).getTime(),
          }))
          .sort((a, b) => b.createdTimestamp - a.createdTimestamp)
          .map((post) => {
            return {
              ...post,
              content: post?.content as string,
            };
          });
        setPosts(sortedPosts);
      } else {
        console.log("No data");
        // You can set a state here to indicate no data, and handle it in your UI
        // For example:
        // setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, for example:
      // setPosts([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    checkIfAdmin();
  }, []);

  const handleNewPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content as string);
    formData.append("uid", nanoid());

    try {
      if (formData.get("content") === "") {
        return;
      }
      const data = await pocketbase.collection("posts").create(formData);
      await fetchData();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const data = await pocketbase.collection("posts").delete(id);
      await fetchData();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDrop = (event: any) => {
    event.preventDefault();

    const dataTransferItems = event?.dataTransfer?.items;

    // Check if files were dropped
    if (dataTransferItems) {
      for (let i = 0; i < dataTransferItems.length; i++) {
        const item = dataTransferItems[i];
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file?.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (event) {
              const imgMarkdown = `![Image Alt Text](${event?.target?.result} "Image Title")\n`;
              setContent((prevMarkdown) => prevMarkdown + imgMarkdown);
            };
            reader.readAsDataURL(file);
          } else {
            setContent("Please drop an image file.\n");
          }
        }
      }
    } else {
      // Attempt to extract URLs from dropped content
      const plainText = event?.dataTransfer?.getData("text/plain");
      const urls = plainText?.match(/(http|https|ftp):\/\/[^\s/$.?#].[^\s]*/gi);

      if (urls && urls.length > 0) {
        for (let i = 0; i < urls.length; i++) {
          const imgMarkdown = `![Image Alt Text](${urls[i]} "Image Title")\n`;
          setContent((prevMarkdown) => prevMarkdown + imgMarkdown);
        }
      } else {
        setContent("Please drop an image file or a URL.\n");
      }
    }
  };

  const renderer = new marked.Renderer();
  const html = marked(content! as string, { renderer });

  if (!isAdmin) {
    router.push("/admin");
    return null;
  }
  return (
    <>
      <form onSubmit={handleNewPost}>
        <div className="relative border-b border-stone-900">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
            onDrop={handleDrop}
            className={
              "min-h-[50vh] w-full resize-none bg-stone-900 p-4 text-stone-100 placeholder:text-stone-600 focus:outline-none"
            }
            placeholder={"Quoi de neuf ?!"}
          />
          <Button
            value={"Poster"}
            type="submit"
            className={
              "absolute bottom-6 right-4 cursor-pointer rounded-full bg-stone-50 px-6 py-3 text-sm font-medium text-stone-950 transition-colors hover:bg-stone-50 hover:text-stone-400"
            }
          />
        </div>
      </form>
      <div className={"p-8"}>
        <ul className="flex flex-col gap-8">
          {posts?.map((post) => (
            <li key={post.id}>
              <Card
                content={post.content as string}
                date={post.created}
                delete={true}
                deleteFn={() => {
                  handleDeletePost(post.id);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
