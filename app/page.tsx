"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { JSONContent } from "@tiptap/react";
import Card from "@/components/ui/Card";
import { generateHTML } from "@tiptap/html";
import Extensions from "@/utils/TiptapExtensions";
import type * as pocketbaseTypes from "@/types/pocketbase-types";
import InfiniteScroll from "react-infinite-scroll-component";
import { useClient } from "@/hooks/use-pb";

export default function Posts() {
  const [posts, setPosts] = useState<pocketbaseTypes.PostsRecord[]>([]);
  const [pageParam, setPageParam] = useState<number | null>(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const perPage = 20;

  const fetchData = async () => {
    try {
      if (pageParam !== null) {
        const client = useClient("posts", {
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
  }, [pageParam]); // Fetch data whenever pageParam changes

  const handleNextPage = () => {
    if (pageParam !== null && totalPages !== null && pageParam < totalPages) {
      setPageParam((prevPageParam) => prevPageParam! + 1);
    }
  };

  if (!posts?.length) return <div className="container my-8">Loading...</div>;

  return (
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
                shareable={true}
              />
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
}
