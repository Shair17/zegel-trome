import { useId, useState } from "react";
import axios from "axios";
import { locations } from "../data";
import { useContactForm } from "../useContactForm";

const Form: React.FC = () => {
  const uniqueId = useId();
  const [displayProvinces, setDisplayProvinces] = useState<string[]>([]);
  const [displayDistricts, setDisplayDistricts] = useState<string[]>([]);
  const [isLM, setIsLM] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useContactForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/methods.json", data);

      if (response.data.ok) {
        window.location.href = "/gracias";
      }
      setIsLoading(false);
    } catch (error) {
      alert("Ocurrió un error inesperado!");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <div className="grid grid-cols-1 grid-rows-4 lg:grid-rows-3 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <label className="block">
            <span className="text-[#ff0049] text-2xl truncate">Nombres</span>

            <input
              type="text"
              className="mt-3 block w-full rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
              placeholder="Ingresa tus nombres"
              {...register("names", { required: true })}
            />
          </label>
          {errors.names?.message ? (
            <p className="mt-1 text-white">{errors.names?.message}</p>
          ) : null}
        </div>
        <div className="lg:col-span-1">
          <label className="block">
            <span className="text-[#ff0049] text-2xl truncate">
              Primer Apellido
            </span>

            <input
              type="text"
              className="mt-3 block w-full rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
              placeholder="Ingresa tu primer apellido"
              {...register("surname", { required: true })}
            />
          </label>
          {errors.surname?.message ? (
            <p className="mt-1 text-white">{errors.surname?.message}</p>
          ) : null}
        </div>
        <div className="lg:col-span-1">
          <label className="block">
            <span className="text-[#ff0049] text-2xl truncate">
              Segundo Apellido
            </span>

            <input
              type="text"
              className="mt-3 block w-full rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
              placeholder="Ingresa tu segundo apellido"
              {...register("secondSurname", { required: true })}
            />
          </label>
          {errors.secondSurname?.message ? (
            <p className="mt-1 text-white">{errors.secondSurname?.message}</p>
          ) : null}
        </div>
        <div className="lg:col-span-1">
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
          </label>
          {errors.dni?.message ? (
            <p className="mt-1 text-white">{errors.dni?.message}</p>
          ) : null}
        </div>
        <div className="lg:col-span-3">
          <label className="block">
            <span className="text-[#ff0049] text-2xl">Correo electrónico</span>

            <input
              type="email"
              className="mt-3 block w-full rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
              placeholder="Ingresa tu correo electrónico"
              {...register("email", { required: true })}
            />
          </label>
          {errors.email?.message ? (
            <p className="mt-1 text-white">{errors.email?.message}</p>
          ) : null}
        </div>
        <div className={`${isLM ? "lg:col-span-2" : "lg:col-span-1"}`}>
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
          </label>
          {errors.phone?.message ? (
            <p className="mt-1 text-white">{errors.phone?.message}</p>
          ) : null}
        </div>
        <div className="col-span-1">
          <label className="block ">
            <span className="text-[#ff0049] text-2xl">Departamento</span>

            <select
              className="block w-full mt-3 rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
              required
              {...register("department", {
                required: true,

                onChange(event) {
                  if (!event.target.value) {
                    return;
                  }

                  setIsLM(event.target.value === "Lima Metropolitana");

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
          {errors.department?.message ? (
            <p className="mt-1 text-white">{errors.department?.message}</p>
          ) : null}
        </div>
        <div className="col-span-1">
          <label className="block ">
            <span className="text-[#ff0049] text-2xl">
              {isLM ? "Distrito" : "Provincia"}
            </span>

            <select
              className="block w-full mt-3 rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
              required
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
          {errors.province?.message ? (
            <p className="mt-1 text-white">{errors.province?.message}</p>
          ) : null}
        </div>
        <div className={`${isLM ? "hidden" : ""} col-span-1`}>
          <label className="block ">
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
          {errors.district?.message ? (
            <p className="mt-1 text-white">{errors.district?.message}</p>
          ) : null}
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
              Política de Privacidad de Trome
            </a>{" "}
            y la{" "}
            <a
              href="https://www.zegelvirtual.com/politicas-privacidad"
              className="underline font-medium"
              target="_blank"
            >
              Política de Privacidad de Zegel Virtual
            </a>
            .
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
          disabled={!isValid || !watch("privacyPolicyAccept") || isLoading}
        >
          {isLoading ? "Cargando..." : "Regístrate aquí"}
        </button>

        <p className="text-white text-center mx-auto text-md md:text-lg lg:text-xl font-bold mt-12">
        * Recuerda que tu curso se activará en las próximas 24 horas.
      </p>
      </div>
    </form>
  );
};

export default Form;
