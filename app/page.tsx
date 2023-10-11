"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import type { JSONContent } from "@tiptap/react";
import Card from "@/components/ui/Card";
import { generateHTML } from "@tiptap/html";
import Extensions from "@/utils/TiptapExtensions";
import type * as pocketbaseTypes from "@/types/pocketbase-types";
import InfiniteScroll from "react-infinite-scroll-component";
import { UseClient } from "@/hooks/use-pb";
import PocketBase from "pocketbase";
import { useRouter } from "next/navigation";
import { customAlphabet } from "nanoid";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Image from "next/image";
const pocketbase = new PocketBase(process.env.POCKETBASE_URL);

export default function Posts() {
  const router = useRouter();
  const nanoid = customAlphabet("1234567890", 16);
  const [posts, setPosts] = useState<pocketbaseTypes.PostsRecord[]>([]);
  const [pageParam, setPageParam] = useState<number | null>(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMNPModalOpen, setIsMNPModalOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [modalPosition, setModalPosition] = useState({ top: 100, left: 100 });
  const perPage = 20;

  const fetchData = async () => {
    try {
      if (pageParam !== null) {
        const client = UseClient("posts", {
          sort: "-created",
          page: pageParam,
          perPage: perPage,
        });
        console.log(UseClient);
        const data: pocketbaseTypes.PostsDetailsRecords =
          (await client.get()) as pocketbaseTypes.PostsDetailsRecords;
        setPosts((prevPosts) =>
          prevPosts ? [...prevPosts, ...data.items] : data.items,
        );
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageParam]);

  const handleNextPage = () => {
    if (pageParam !== null && totalPages !== null && pageParam < totalPages) {
      setPageParam((prevPageParam) => prevPageParam! + 1);
    }
  };
  const checkIfAdmin = async () => {
    const adm = await pocketbase.authStore.isAdmin;
    if (adm) {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    checkIfAdmin();
    handleNewPost();
  });

  const handleNewPost = () => {
    if (isAdmin) {
      window.addEventListener("keydown", (e) => {
        if (e.shiftKey && e.code === "KeyN") {
          setIsMNPModalOpen(!isMNPModalOpen);
        }
      });
    }
  };

  const handleSubmitPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content as string);
    formData.append("uid", nanoid());

    try {
      if (formData.get("content") === "") {
        return;
      }
      const data: pocketbaseTypes.PostsRecord = await pocketbase
        .collection("posts")
        .create(formData);
      setPosts((prevPosts) => (prevPosts ? [data, ...prevPosts] : [data]));
    } catch (err: any) {
      console.error(err);
    }
    setContent("");
    setIsMNPModalOpen(false);
  };

  if (!posts?.length) return <div className="container my-8">Loading...</div>;

  // TODO: Sanitize HTML before posting

  return (
    <>
      {isMNPModalOpen && (
        <div
          className={
            "modal fixed z-50 flex h-full w-full items-start justify-center bg-stone-600/25 pt-8"
          }
        >
          <div
            className={
              "new-post-card modal-content flex w-1/2 overflow-y-auto rounded-xl bg-stone-950"
            }
          >
            <div className="relative flex w-full">
              <form
                onSubmit={handleSubmitPost}
                className={"column flex w-full flex-col"}
              >
                <div className={"flex gap-4 p-4"}>
                  <div className="author py-2">
                    <Image
                      src="https://pbs.twimg.com/profile_images/1676765556815347712/c8rE28JU_x96.jpg"
                      alt="avatar"
                      className={"max-w-12 max-h-12 rounded-full object-cover"}
                    />
                  </div>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.currentTarget.value)}
                    className={
                      "h-48 w-full resize-none bg-transparent p-4 text-xl text-stone-100 placeholder:text-xl placeholder:text-stone-600 focus:outline-none"
                    }
                    placeholder="Quel est votre mood actuellement ? 🤔"
                  />
                </div>
                <div
                  className={
                    "flex w-full justify-end gap-4 border-t border-stone-800 p-4"
                  }
                >
                  <Button
                    value={"Poster"}
                    type="submit"
                    title={"Poster"}
                    className={
                      "bottom-6 right-4 cursor-pointer rounded-full bg-stone-50 px-6 py-3 text-sm font-medium text-stone-950 transition-colors hover:bg-stone-50 hover:text-stone-400"
                    }
                  />
                  <Button
                    type="button"
                    value={"Annuler"}
                    onClick={() => setIsMNPModalOpen(false)}
                    className={
                      "bottom-6 right-4 cursor-pointer rounded-full border border-stone-50 bg-transparent px-6 py-3 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-50 hover:text-stone-400"
                    }
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="container">
        <InfiniteScroll
          dataLength={posts.length}
          next={handleNextPage}
          hasMore={
            pageParam !== null && totalPages !== null && pageParam < totalPages
          }
          loader={<div>Loading...</div>}
        >
          <ul className={"flex flex-col"}>
            {posts?.map((post, index) => (
              <li key={index}>
                <Card
                  content={post.content as string}
                  date={post.created}
                  uid={post.uid}
                />
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      </div>
    </>
  );
}
