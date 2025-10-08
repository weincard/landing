import { CreateOrEditAlly } from "@/views/Allies/components/CreateOrEditAlly";
import React from "react";

export default async function EditAllyPage({ params }: any) {
  const { id } = await params;
  console.log("PARAMS ID:", id);
  return <CreateOrEditAlly allyId={id} />;
}
