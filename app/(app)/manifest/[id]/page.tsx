import Image from "next/image";
const basicData = [
  "Driver's Name",
  "Time of Departure",
  "Vehicle No",
  "From",
  "To",
  "Date",
  "Make of Vehicle",
];

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Image src="/coatOfArms.svg" width={80} height={80} alt="coat of arm" />

        <div className="text-center">
          <h1 className="font-bold text-3xl">CHUKWUBUIKEM MOTORS LTD</h1>
          <h3>185, Abeokuta Exp Way, Iyana-Ipaja, Lagos</h3>
          <h2>CBM Passenger Manifest</h2>
          <h3>www.travelcbm.com</h3>
          <p>08037015262, 07082177964, 09035913402</p>
        </div>

        <Image width={80} height={80} src="/cbmlogo.jpg" alt="cbm logo" />
      </div>
      <table className="table w-full gap-10 grid grid-cols-4 m-2">
        {basicData.map((item, index) => (
          <tr className="border-b border-b-black" key={index}>
            <td>{item} :</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Page;
