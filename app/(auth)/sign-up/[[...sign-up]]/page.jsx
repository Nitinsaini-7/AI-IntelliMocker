import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return(
    <>
<section className="bg-white">
  <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
    <aside className="relative block h-52 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6 items-center justify-center">
     <Image src={"/signup.gif"} width={600} height={600}></Image>
    </aside>

    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl ">
      
        <SignUp/>

      </div>
    </main>
  </div>
</section>
    </>
  );
}