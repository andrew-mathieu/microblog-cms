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
import { AiOutlineSend } from "react-icons/ai";
import colors from "@/lib/colors";
const pocketbase = new PocketBase(process.env.POCKETBASE_URL);

type Post = {
  id?: string;
  created?: string;
  content?: string;
};

export default function NewArticle() {
  const nanoid = customAlphabet("1234567890", 16);
  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<Post[] & pocketbaseTypes.PostsRecord[]>(
    [],
  );
  const [rows, setRows] = useState<number>(1);
  const maxWidth = 600; // Largeur maximale moins 96px pour les caractères
  const fontSize = 18;
  const maxRows = 4;
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isPosted, setIsPosted] = useState<boolean>(false);

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const checkIfAdmin = async () => {
    const adm = await pocketbase.authStore.isAdmin;
    if (adm) {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    checkIfAdmin();
  });

  const handleNewPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content as string);
    formData.append("uid", nanoid());
    formData.append("color", randomColor);

    try {
      if (formData.get("content") === "") {
        return;
      }
      const data = await pocketbase.collection("posts").create(formData);
      if (data) {
        setIsPosted(true);
        setContent("");
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    const lineWidth = content.length * fontSize * 0.6;
    const lines = Math.max(1, Math.ceil(lineWidth / maxWidth));
    setRows(Math.min(lines, maxRows));
  }, [content]);

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
        <div className="grid min-h-screen place-items-center">
          <div className="relative flex w-[600px] items-center">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.currentTarget.value)}
              rows={rows || 1}
              className={
                "w-full resize-none rounded-2xl p-8 pr-24 text-lg leading-normal shadow-sm outline-none"
              }
              placeholder={"Quoi de neuf ?!"}
            />
            <Button
              value={<AiOutlineSend />}
              type="submit"
              className={
                "absolute right-4 cursor-pointer rounded-full bg-black p-4 text-sm font-medium text-white"
              }
            />
          </div>
        </div>
      </form>
    </>
  );
}
