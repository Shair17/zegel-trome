import { z } from "zod";
import { locations } from "./data";

export const formSchema = z
  .object({
    names: z
      .string({
        required_error: "Nombre(s) requerido(s).",
        invalid_type_error: "Ingresa nombre(s) válido(s).",
      })
      .min(2, { message: "Ingresa nombre(s) válido(s)." }),
    surname: z
      .string({
        required_error: "Primer apellido requerido.",
        invalid_type_error: "Ingresa un apellido válido.",
      })
      .min(2, { message: "Ingresa un apellido válido." }),
    secondSurname: z
      .string({
        required_error: "Segundo apellido requerido.",
        invalid_type_error: "Ingresa un apellido válido.",
      })
      .min(2, { message: "Ingresa un apellido válido." }),
    dni: z
      .string({
        required_error: "DNI requerido.",
        invalid_type_error: "Ingresa tu DNI válido.",
      })
      .min(8, { message: "Ingresa tu DNI válido." })
      .max(8, { message: "Ingresa tu DNI válido." })
      .regex(/^\d+$/, { message: "Ingresa tu DNI válido." }),
    email: z
      .string({
        required_error: "Correo electrónico requerido.",
        invalid_type_error: "Ingresa un correo electrónico válido.",
      })
      .email({
        message: "Ingresa un correo electrónico válido.",
      }),
    phone: z
      .string({
        required_error: "Celular requerido.",
        invalid_type_error: "Ingresa un número de celular válido.",
      })
      .min(9, { message: "Ingresa un número de celular válido." })
      .max(9, { message: "Ingresa un número de celular válido." })
      .startsWith("9", { message: "Ingresa un número de celular válido." })
      .regex(/^\d+$/, { message: "Ingresa un número de celular válido." }),
    department: z.string(),
    province: z.string(),
    district: z.string(),
    privacyPolicyAccept: z.boolean().default(false),
    dataUsageAccept: z.boolean().default(false).optional(),
  })
  .refine((data) => {
    const { department, province, district } = data;
    const isLimaMetropolitana =
      Boolean(department) && department === "Lima Metropolitana";

    if (!Boolean(department) || !Boolean(province)) {
      return false;
    }

    if (isLimaMetropolitana) {
      return true;
    }

    if (!Boolean(district)) {
      return false;
    }

    return (
      !!department &&
      department in locations &&
      Object.keys(locations[department as keyof typeof locations]).includes(
        province
      ) &&
      !!district &&
      // @ts-ignore
      locations[department as keyof typeof locations][province].includes(
        district
      )
    );
  });

export type FormDataValues = z.infer<typeof formSchema>;
