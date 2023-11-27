"use client";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import PocketBase from "pocketbase";
import type * as pocketbaseTypes from "@/types/pocketbase-types";
import { UseClient } from "@/hooks/use-pb";
import InfiniteScroll from "react-infinite-scroll-component";

const pocketbase = new PocketBase(process.env.POCKETBASE_URL);

interface Post extends pocketbaseTypes.PostsRecord {
  id: string;
}

export default function Manage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pageParam, setPageParam] = useState<number | null>(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const perPage = 24;

  const checkIfAdmin = async () => {
    const adm = pocketbase.authStore.isAdmin;
    if (adm) {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    checkIfAdmin();
  });

  const fetchData = async () => {
    try {
      if (pageParam !== null) {
        const client = UseClient("posts", {
          sort: "-created",
          page: pageParam,
          perPage: perPage,
        });
        const data: pocketbaseTypes.PostsResponse[] & any =
          (await client.get()) as pocketbaseTypes.PostsResponse[];
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

  const handleDeletePost = async (id: string) => {
    try {
      await pocketbase.collection("posts").delete(id);
      const newPosts = posts.filter((post) => post.id !== id);
      setPosts(newPosts);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (!isAdmin) {
    return (
      <>
        <h1>Manage</h1>
        <p>
          You can&apos;t perform actions on this page because you aren&apos;t an
          admin.
        </p>
      </>
    );
  }

  return (
    <>
      <InfiniteScroll
        className="overflow-x-hidden"
        dataLength={posts.length}
        next={handleNextPage}
        hasMore={
          pageParam !== null && totalPages !== null && pageParam < totalPages
        }
        loader={<div>Loading...</div>}
      >
        <ul className="grid w-full grid-cols-3 gap-8 p-8">
          {posts?.map((post, index) => (
            <li className="relative flex h-full w-full" key={index}>
              <Card
                key={index}
                content={post.content as string}
                date={post.created as string}
                uid={post.uid}
                delete={true}
                deleteFn={() => handleDeletePost(post.id)}
                styling={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: "2px solid #f5d0fe",
                  color: "#f5d0fe",
                  gap: 16,
                  width: "100%",
                  maxWidth: "100%",
                }}
              />
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </>
  );
}
