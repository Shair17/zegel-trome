import { useId, useState } from "react";
import axios from "axios";
import { locations } from "../data";
import { useContactForm } from "../useContactForm";

// https://www.mercadolibre.com.pe/addresses/v2/address?app=NAVIGATION&confirmation_url=https%3A%2F%2Fwww.mercadolibre.com.pe%2F&validator=4de38498f91047eb49f1a5955b15cd45fec016ea&update_current_location=true

const Form: React.FC = () => {
  const uniqueId = useId();
  const [displayProvinces, setDisplayProvinces] = useState<string[]>([]);
  const [displayDistricts, setDisplayDistricts] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useContactForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);

      const response = await axios.post("/methods.json", data);

      if (response.data.ok) {
        window.location.href = "/gracias";
      }
    } catch (error) {
      console.log(error);
      alert("Ocurrió un error inesperado!");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <div className="grid grid-cols-1 grid-rows-3 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <label className="block">
            <span className="text-[#ff0049] text-2xl">Nombre completo</span>

            <input
              type="text"
              className="mt-3 block w-full rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
              placeholder="Ingresa tu nombre completo"
              {...register("fullName", { required: true })}
            />
            {errors.fullName?.message ? (
              <p className="mt-1 text-white">{errors.fullName?.message}</p>
            ) : null}
          </label>
        </div>
        <div className="lg:row-start-2">
          <label className="block">
            <span className="text-[#ff0049] text-2xl">DNI</span>

            <input
              type="text"
              className="mt-3 block w-full rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
              placeholder="Ingresa tu DNI"
              minLength={8}
              maxLength={8}
              {...register("dni", {
                required: true,
                minLength: 8,
                maxLength: 8,
              })}
            />
            {errors.dni?.message ? (
              <p className="mt-1 text-white">{errors.dni?.message}</p>
            ) : null}
          </label>
        </div>
        <div className="col-span-1 lg:col-span-2 lg:row-start-2">
          <label className="block">
            <span className="text-[#ff0049] text-2xl">Correo electrónico</span>

            <input
              type="email"
              className="mt-3 block w-full rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
              placeholder="Ingresa tu correo electrónico"
              {...register("email", { required: true })}
            />
            {errors.email?.message ? (
              <p className="mt-1 text-white">{errors.email?.message}</p>
            ) : null}
          </label>
        </div>
        <div className="lg:row-start-3">
          <label className="block">
            <span className="text-[#ff0049] text-2xl">Celular</span>

            <input
              type="text"
              className="mt-3 block w-full rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
              placeholder="Ingresa tu número de celular"
              minLength={9}
              maxLength={9}
              {...register("phone", {
                required: true,
                minLength: 9,
                maxLength: 9,
              })}
            />
            {errors.phone?.message ? (
              <p className="mt-1 text-white">{errors.phone?.message}</p>
            ) : null}
          </label>
        </div>
        <div className="col-span-1 lg:col-span-2 lg:row-start-3 flex gap-6">
          <label className="block flex-1">
            <span className="text-[#ff0049] text-2xl">Departamento</span>

            <select
              className="block w-full mt-3 rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
              {...register("department", {
                required: true,
                onChange(event) {
                  if (!event.target.value) {
                    return;
                  }

                  const provinces =
                    Object.keys(
                      locations[event.target.value as keyof typeof locations]
                    ) ?? [];
                  setDisplayProvinces(provinces);
                  reset({ province: "", district: "" });
                },
              })}
            >
              <option value="">Selecciona</option>

              {Object.entries(locations).map(([department]) => {
                return (
                  <option
                    key={`${uniqueId}-option-department-${department}`}
                    value={department}
                  >
                    {department}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="block flex-1">
            <span className="text-[#ff0049] text-2xl">Provincia</span>

            <select
              className="block w-full mt-3 rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
              {...register("province", {
                required: true,
                onChange(event) {
                  if (!event.target.value) {
                    return;
                  }

                  const districts =
                    // @ts-ignore
                    (locations[watch("department") as keyof typeof locations][
                      event.target.value
                    ] as string[]) ?? [];

                  setDisplayDistricts(districts);
                  reset({ district: "" });
                },
              })}
            >
              <option value="">Selecciona</option>

              {displayProvinces.map((province) => (
                <option
                  key={`${uniqueId}-option-province-${province}`}
                  value={province}
                >
                  {province}
                </option>
              ))}
            </select>
          </label>

          <label className="block flex-1">
            <span className="text-[#ff0049] text-2xl">Distrito</span>

            <select
              className="block w-full mt-3 rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
              {...register("district", { required: true })}
            >
              <option value="">Selecciona</option>

              {displayDistricts.map((districts) => (
                <option
                  key={`${uniqueId}-option-districts-${districts}`}
                  value={districts}
                >
                  {districts}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 justify-center items-center flex-col flex">
        <label className="inline-flex items-center justify-center">
          <input
            type="checkbox"
            className="rounded bg-gray-200 border-transparent focus:border-transparent focus:bg-gray-200 text-[#ff0049] focus:ring-1 focus:ring-offset-2 focus:ring-red-500"
            {...register("privacyPolicyAccept", { required: true })}
          />
          {errors.privacyPolicyAccept?.message ? (
            <p className="mt-1 text-white">
              {errors.privacyPolicyAccept?.message}
            </p>
          ) : null}

          <span className="ml-2 text-[#ff0049]">
            He leído y acepto de manera expresa la{" "}
            <a
              href="https://trome.com/politica-de-privacidad"
              className="underline font-medium"
              target="_blank"
            >
              Política de Privacidad
            </a>
          </span>
        </label>
        <label className="inline-flex items-center justify-center">
          <input
            type="checkbox"
            className="rounded bg-gray-200 border-transparent focus:border-transparent focus:bg-gray-200 text-[#ff0049] focus:ring-1 focus:ring-offset-2 focus:ring-red-500"
            {...register("dataUsageAccept", { required: true })}
          />
          {errors.dataUsageAccept?.message ? (
            <p className="mt-1 text-white">
              {errors.privacyPolicyAccept?.message}
            </p>
          ) : null}

          <span className="ml-2 text-[#ff0049]">
            Autorizo el uso de mis datos para{" "}
            <a
              href="https://trome.com/tratamiento-de-datos"
              className="underline font-medium"
              target="_blank"
            >
              fines adicionales
            </a>
            , inscribirme al{" "}
            <a
              href="https://trome.com/club-trome"
              className="underline font-medium"
              target="_blank"
            >
              Club Trome
            </a>{" "}
            y acceder a grandes beneficios.
          </span>
        </label>
        <button
          type="submit"
          className="select-none inline-flex justify-center rounded-full text-xl font-bold py-3 px-8 bg-[#ff0049] text-white hover:bg-[#FF3F63] transition-all uppercase shadow-md hover:shadow-2xl mt-12 w-full lg:w-auto disabled:pointer-events-none disabled:bg-opacity-60"
          disabled={!isValid || !watch("privacyPolicyAccept")}
        >
          Regístrate aquí
        </button>
      </div>
    </form>
  );
};

export default Form;
