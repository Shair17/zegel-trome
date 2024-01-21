import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, type FormDataValues } from "./schema";

export const useContactForm = () =>
  useForm<FormDataValues>({
    resolver: zodResolver(formSchema),
  });
