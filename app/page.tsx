"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import type { JSONContent } from "@tiptap/react";
import Card from "@/components/ui/Card";
import { generateHTML } from "@tiptap/html";
import Extensions from "@/utils/TiptapExtensions";
import type * as pocketbaseTypes from "@/types/pocketbase-types";
import InfiniteScroll from "react-infinite-scroll-component";
import colors from "@/lib/colors";
import { UseClient } from "@/hooks/use-pb";
import PocketBase from "pocketbase";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { useRouter } from "next/navigation";
import { customAlphabet } from "nanoid";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
const pocketbase = new PocketBase(process.env.POCKETBASE_URL);

export default function Posts() {
  const router = useRouter();
  const nanoid = customAlphabet("1234567890", 16);
  const [posts, setPosts] = useState<pocketbaseTypes.PostsRecord[]>([]);
  const [pageParam, setPageParam] = useState<number | null>(1);
  const [isShowMoreOpen, setIsShowMoreOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMNPModalOpen, setIsMNPModalOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const perPage = 20;

  gsap.registerPlugin(Draggable);

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

  useEffect(() => {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {
      gsap.set(card, {
        rotate: Math.floor(Math.random() * 4) - 2,
        background: posts[index]?.color
          ? posts[index].color
          : colors[Math.floor(Math.random() * colors.length)],
      });

      Draggable.create(card, {
        type: "x,y",
        bounds: ".container",
        edgeResistance: 0.85,
        cursor: "pointer",
        onDragStart: function () {
          gsap.to(this.target, {
            scale: 1.1,
            duration: 0.2,
            easing: "expo.out",
          });
        },
        onDragEnd: function () {
          gsap.to(this.target, {
            scale: 1,
            duration: 0.2,
            easing: "expo.out",
          });
        },
      });
    });
  }, [posts]);

  const showMore = (index: any) => {
    const cardId = posts[index].uid;
    const post = posts[index];
    setIsShowMoreOpen(!isShowMoreOpen);
    setSelectedPost(post);
  };

  if (!posts?.length) return <div className="container my-8">Loading...</div>;

  // TODO: Sanitize HTML before posting

  return (
    <>
      <div>
        {isShowMoreOpen && (
          <>
            <Modal
              content={selectedPost.content}
              date={selectedPost.created}
              close={() => setIsShowMoreOpen(!isShowMoreOpen)}
            />
          </>
        )}

        <InfiniteScroll
          className="overflow-x-hidden"
          dataLength={posts.length}
          next={handleNextPage}
          hasMore={
            pageParam !== null && totalPages !== null && pageParam < totalPages
          }
          loader={<div>Loading...</div>}
        >
          <ul className="container flex h-full w-full flex-col gap-4 py-4 md:py-32">
            {posts?.map((post, index) => (
              <li
                className="relative flex h-full w-full even:justify-end"
                key={index}
              >
                <Card
                  key={index}
                  content={post.content as string}
                  date={post.created}
                  uid={post.uid}
                  modal={() => showMore(index)}
                />
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      </div>
    </>
  );
}
