import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return(<>
<section className="bg-white">
  <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
    <section className="block relative h-52 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6 ">
    <Image src={"/login.gif"} width={600} height={600} className=""></Image>
  
    </section>

    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl">
        <SignIn/>
        
      </div>
    </main>
  </div>
</section>
  </>) 
}
// <a href="https://storyset.com/user">User illustrations by Storyset</a>
// <a href="https://storyset.com/user">User illustrations by Storyset</a>