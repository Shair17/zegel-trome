import { useState, type FormEvent } from "react";
import axios from "axios";

const INITIAL_STATE = {
  fullName: "",
  dni: "",
  email: "",
  phone: "",
  location: "",
  privacyPolicyAccept: false,
  dataUsageAccept: false,
};

const Form: React.FC = () => {
  const [form, setForm] = useState(INITIAL_STATE);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await axios.post("/methods.json", form);
      alert("Tus datos han sido registrados!");
      setForm(INITIAL_STATE);
    } catch (error) {
      console.log(error);
      setForm(INITIAL_STATE);
      alert("Ocurrió un error inesperado!");
    }
  };

  return (
    <form
      className="grid grid-cols-1 grid-rows-4 lg:grid-cols-3 gap-6"
      onSubmit={handleSubmit}
    >
      <div className="lg:col-span-3">
        <label className="block">
          <span className="text-[#ff0049] text-2xl">Nombre completo</span>

          <input
            type="text"
            value={form.fullName}
            onChange={(event) => {
              setForm({ ...form, fullName: event.target.value });
            }}
            className="mt-3 block w-full rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
            placeholder="Ingresa tu nombre completo"
          />
        </label>
      </div>
      <div className="lg:row-start-2">
        <label className="block">
          <span className="text-[#ff0049] text-2xl">DNI</span>

          <input
            type="text"
            pattern="\d*"
            value={form.dni}
            onChange={(event) => {
              if (
                !/^-?\d*\.?\d+$/.test(event.target.value) &&
                event.target.value !== ""
              )
                return;

              setForm({ ...form, dni: event.target.value });
            }}
            maxLength={8}
            className="mt-3 block w-full rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
            placeholder="Ingresa tu DNI"
          />
        </label>
      </div>
      <div className="col-span-1 lg:col-span-2 lg:row-start-2">
        <label className="block">
          <span className="text-[#ff0049] text-2xl">Correo electrónico</span>

          <input
            type="email"
            value={form.email}
            onChange={(event) => {
              setForm({ ...form, email: event.target.value });
            }}
            className="mt-3 block w-full rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
            placeholder="Ingresa tu correo electrónico"
          />
        </label>
      </div>
      <div className="lg:row-start-3">
        <label className="block">
          <span className="text-[#ff0049] text-2xl">Celular</span>

          <input
            type="text"
            pattern="\d*"
            value={form.phone}
            onChange={(event) => {
              if (
                !/^-?\d*\.?\d+$/.test(event.target.value) &&
                event.target.value !== ""
              )
                return;

              setForm({ ...form, phone: event.target.value });
            }}
            maxLength={9}
            className="mt-3 block w-full rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
            placeholder="Ingresa tu celular"
          />
        </label>
      </div>
      <div className="col-span-1 lg:col-span-2 lg:row-start-3">
        <label className="block">
          <span className="text-[#ff0049] text-2xl">
            Departamento / Provincia / Distrito
          </span>

          <input
            type="text"
            value={form.location}
            onChange={(event) => {
              setForm({ ...form, location: event.target.value });
            }}
            className="mt-3 block w-full rounded-xl bg-white border-transparent focus:border-neutral-200 focus:bg-neutral-100 focus:ring-0 text-xl"
            placeholder="Ingresa tu Departamento / Provincia / Distrito"
          />
        </label>
      </div>

      <div className="lg:col-span-3 lg:row-start-4 justify-center items-center flex-col flex">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={form.privacyPolicyAccept}
            onChange={() => {
              setForm({
                ...form,
                privacyPolicyAccept: !form.privacyPolicyAccept,
              });
            }}
            className="rounded bg-gray-200 border-transparent focus:border-transparent focus:bg-gray-200 text-[#ff0049] focus:ring-1 focus:ring-offset-2 focus:ring-red-500"
          />
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
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={form.dataUsageAccept}
            onChange={() => {
              setForm({
                ...form,
                dataUsageAccept: !form.dataUsageAccept,
              });
            }}
            className="rounded bg-gray-200 border-transparent focus:border-transparent focus:bg-gray-200 text-[#ff0049] focus:ring-1 focus:ring-offset-2 focus:ring-red-500"
          />
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
          className="inline-flex justify-center rounded-full text-xl font-bold py-3 px-8 bg-[#ff0049] text-white hover:bg-[#FF3F63] transition-all uppercase shadow-md hover:shadow-2xl mt-4 w-full lg:w-auto disabled:pointer-events-none disabled:bg-opacity-60"
          disabled={!form.privacyPolicyAccept}
        >
          Regístrate aquí
        </button>
      </div>
    </form>
  );
};

export default Form;
