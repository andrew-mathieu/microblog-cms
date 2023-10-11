"use client";
import { FormEvent, useState, useEffect } from "react";
import PocketBase from "pocketbase";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { customAlphabet } from "nanoid";
import Textarea from "@/components/ui/Textarea";
import { UseClient } from "@/hooks/use-pb";
import type * as pocketbaseTypes from "@/types/pocketbase-types";
import InfiniteScroll from "react-infinite-scroll-component";
const pocketbase = new PocketBase(process.env.POCKETBASE_URL);

type Post = {
  id?: string;
  created?: string;
  content?: string;
};

export default function NewArticle() {
  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<Post[] & pocketbaseTypes.PostsRecord[]>(
    [],
  );
  const nanoid = customAlphabet("1234567890", 16);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [pageParam, setPageParam] = useState<number | null>(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const perPage = 20;

  const checkIfAdmin = async () => {
    const adm = await pocketbase.authStore.isAdmin;
    if (adm) {
      setIsAdmin(true);
    }
  };

  const fetchData = async () => {
    try {
      if (pageParam !== null) {
        const client = UseClient("posts", {
          sort: "-created",
          page: pageParam,
          perPage: perPage,
        });
        const data: pocketbaseTypes.PostsDetailsRecords =
          (await client.get()) as pocketbaseTypes.PostsDetailsRecords;
        setPosts((prevPosts: any) =>
          prevPosts ? [...prevPosts, ...data.items] : data.items,
        );
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    checkIfAdmin();
  }, []);

  useEffect(() => {
    fetchData();
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

  const handleNextPage = () => {
    if (pageParam !== null && totalPages !== null && pageParam < totalPages) {
      setPageParam((prevPageParam) => prevPageParam! + 1);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container grid min-h-screen place-items-center">
        <p>Vous n&apos;êtes pas admin</p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleNewPost}>
        <div className="relative border-b border-stone-900">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
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
        <InfiniteScroll
          dataLength={posts.length}
          next={handleNextPage}
          hasMore={
            pageParam !== null && totalPages !== null && pageParam < totalPages
          }
          loader={<div>Loading...</div>}
        >
          <ul className="flex flex-col gap-8">
            {posts?.map((post, index) => (
              <li key={index}>
                <Card
                  content={post.content as string}
                  date={post.created as string}
                  delete={true}
                  deleteFn={() => {
                    handleDeletePost(post.id as string);
                  }}
                />
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      </div>
    </>
  );
}
