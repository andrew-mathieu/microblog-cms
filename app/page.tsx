"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import * as pocketbase from "@/lib/pb";
import type { JSONContent } from "@tiptap/react";
import Card from "@/components/ui/Card";
import { generateHTML } from "@tiptap/html";
import Extensions from "@/utils/TiptapExtensions";

export default function Posts() {
  const [posts, setPosts] = useState<pocketbase.types.PostsResponse[]>([]);
  const [pageParam, setPageParam] = useState<number>(1);

  const fetchData = async () => {
    try {
      const data: pocketbase.types.PostsResponse[] = await pocketbase.client
        .collection("posts")
        .getFullList({ sort: "-created", page: pageParam, perPage: 30 });
      console.log(data);
      if (!data) return;
      setPosts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container my-8">
      {!posts?.length ? (
        <>
          <h1>Loading…</h1>
        </>
      ) : (
        <ul className={"flex flex-col gap-8"}>
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
      )}
    </div>
  );
}
