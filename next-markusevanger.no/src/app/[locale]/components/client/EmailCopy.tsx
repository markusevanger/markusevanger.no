"use client"

import { t } from "i18next";
import { MailIcon } from "lucide-react";
import { useState } from "react";



export default function EmailCopy() {


  const [emailCopiedBadge, setEmailCopiedBadge] = useState(false)
  const copyMail = () => {
    const textToCopy = "markusevanger@gmail.com";
    navigator.clipboard.writeText(textToCopy);
    setEmailCopiedBadge(true)
    setTimeout(() => {
      setEmailCopiedBadge(false);
    }, 2000);
  }


  return <><MailIcon size={16} /> {emailCopiedBadge && <p>ah</p>} <span onClick={copyMail} title={t("bottom.clickToCopy")} className="cursor-pointer underline"> markusevanger@gmail.com</span></>
}

