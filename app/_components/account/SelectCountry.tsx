import { getCountries } from "@/app/_lib/data-service";

async function SelectCountry({
  defaultCountry,
  defaultFlag,
  name,
  id,
  className,
}: {
  defaultCountry: string;
  defaultFlag: string;
  name: string;
  id: string;
  className: string;
}) {
  const countries = await getCountries();
  return (
    <select name={name} id={id} defaultValue={`${defaultCountry}%${defaultFlag}`} className={className}>
      <option value="">Select country...</option>
      {countries.map((c) => (
        <option key={c.name} value={`${c.name}%https://flagcdn.com/${c.flag.toLowerCase()}.svg`}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
