"use client";

import { IconClose, IconSize } from "@/components/atoms/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queryString } from "@/utils/queryString";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChangeEmailProps } from "./types";

export default function ChangeEmail({ lang, locale }: ChangeEmailProps) {
  const currentPathName = usePathname();
  const searchParams = useSearchParams();
  let query = {};
  if (searchParams?.entries) {
    query = Object.fromEntries(searchParams?.entries());
  }

  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [retypeNewEmail, setRetypeNewEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    // console.log("Form submitted:", {
    //   type: "addwallet",
    // });
  };

  return (
    <div className="h-screen flex flex-col px-6 overflow-y-auto md:min-h-screen scrollbar-hide">
      {/* Header */}
      <div className="flex justify-end pt-[17px]">
        <Link
          href={{
            pathname: currentPathName,
            query: queryString({
              ...query,
              email: undefined,
            }),
          }}
          className=""
        >
          <IconClose size={IconSize.md} className="text-app-text-color" />
        </Link>
      </div>
      <div>
        <div className="flex items-center pb-6">
          <div className="text-xl font-bold uppercase text-app-text-color">
            {lang?.common?.changeEmail}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          {/* Withdrawal Amount */}
          <div className="mb-6">
            <Label className="text-app-text-color text-sm mb-2 block">
              {lang?.common?.currentEmail}
              <span className="text-app-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder={lang?.common?.typeCurrentEmail}
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <Label className="text-app-text-color text-sm mb-2 block">
              {lang?.common?.newEmail}
              <span className="text-app-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder={lang?.common?.typeNewEmail}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <Label className="text-app-text-color text-sm mb-2 block">
              {lang?.common?.retypeNewEmail}
              <span className="text-app-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder={lang?.common?.typeRetypeNewEmail}
              value={retypeNewEmail}
              onChange={(e) => setRetypeNewEmail(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-auto pb-6">
            <Button
              type="submit"
              className="w-full bg-app-primary uppercase hover:bg-app-primary-hover text-white py-4 text-lg font-medium rounded-lg transition-colors"
            >
              {lang?.common?.save}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
