"use client";
import { cookies } from "next/headers";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PocketBase from "pocketbase";
import Link from "next/link";
import Button from "@/components/ui/Button";

const pocketbase = new PocketBase("https://pocketbase-container.fly.dev");

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  (async () => {
    const data = await pocketbase.authStore.model;
    if (data) {
      setIsLoggedIn(true);
    }
  })();

  const handleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await pocketbase.admins.authWithPassword(email, password);
    setIsLoggedIn(true);
    // await pocketbase.admins.authWithPassword(email, password);
  };

  useEffect(() => {
    isLoggedIn ? router.push("/admin/post/new") : null;
  });

  const retrieveSession = async () => {
    const data = pocketbase.authStore.token;
    console.log(data);
  };

  const handleLogOut = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const data = pocketbase.authStore.clear();
    setIsLoggedIn(false);
    console.log(data);
  };

  return (
    <div className="container grid min-h-screen place-items-center">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form
          onSubmit={handleSignIn}
          className={"flex w-[512px] flex-col gap-4 p-4"}
        >
          <input
            type="text"
            name="email"
            onChange={(e) => {
              e.preventDefault();
              setEmail(e.target.value);
            }}
            value={email}
            placeholder={"Email"}
            className={
              "w-full resize-none rounded-md bg-stone-900 p-4 text-xl text-stone-100 placeholder:text-xl placeholder:text-stone-600 focus:outline-none"
            }
          />
          <div className="flex flex-col justify-end gap-2">
            <input
              type="password"
              name="password"
              onChange={(e) => {
                e.preventDefault();
                setPassword(e.target.value);
              }}
              value={password}
              placeholder={"Password"}
              className={
                "w-full resize-none rounded-md bg-stone-900 p-4 text-xl text-stone-100 placeholder:text-xl placeholder:text-stone-600 focus:outline-none"
              }
            />
            <Button
              type="button"
              value={"Show password"}
              className={
                "cursor-pointer text-right text-sm font-medium text-stone-100 underline hover:text-stone-400"
              }
              onClick={(e) => {
                e.preventDefault();
                const passwordInput = document.querySelector(
                  'input[name="password"]',
                ) as HTMLInputElement;
                if (passwordInput.type === "password") {
                  passwordInput.type = "text";
                } else {
                  passwordInput.type = "password";
                }
              }}
            />
          </div>
          <Button
            value={"Login"}
            type="submit"
            className={
              "mt-8 w-full rounded-md bg-stone-50 p-4 font-semibold text-stone-950"
            }
          />
        </form>
      )}
    </div>
  );
}
