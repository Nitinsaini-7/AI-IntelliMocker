import Image from "next/image";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="mx-auto max-w-screen-xl px-4 pt-2 sm:px-6 lg:px-8">
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-32">
          <div className="mx-auto max-w-sm lg:max-w-none">
            <Image src={"/logo.svg"} height={100} width={100}></Image>
            <p className="mt-4 text-center text-white lg:text-left lg:text-lg">
            Transform your interview skills with <span className="text-blue-500 font-bold">AI Mock Interviewer</span>.
            <br />
            Go-to the platform for personalized mock interviews, real-time feedback, and strategic tips to ace your career milestones
            </p>

            <div className="mt-6 flex justify-center gap-4 lg:justify-start">
              <ul className="col-span-2 flex justify-start gap-6 lg:col-span-5 lg:justify-end">
                <li>
                  <Link href={""}>
                    <div className="group w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 hover:bg-white">
                      <FontAwesomeIcon
                        className="text-white text-2xl group-hover:text-black"
                        icon={faXTwitter}
                      />
                    </div>
                  </Link>
                </li>

                <li>
                  <Link href={""}>
                    <div className="group w-12 h-12  flex items-center justify-center rounded-full bg-blue-500 hover:bg-white">
                      <FontAwesomeIcon
                        className="text-white text-2xl group-hover:text-orange-500"
                        icon={faInstagram}
                      />
                    </div>
                  </Link>
                </li>

                <li>
                  <Link href={""}>
                    <div className="group w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 hover:bg-white">
                      <FontAwesomeIcon
                        className="text-white text-2xl group-hover:text-blue-500"
                        icon={faFacebook}
                      />
                    </div>
                  </Link>
                </li>

                <li>
                  <Link href={""}>
                    <div className="group w-12 h-12  flex items-center flex-row justify-center rounded-full bg-blue-500 hover:bg-white">
                      <FontAwesomeIcon
                        className="text-white text-2xl group-hover:text-red-500"
                        icon={faEnvelope}
                      />
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 text-center lg:grid-cols-3 text-gray-400 lg:text-left">
            <div>
              <strong className="text-gray-300 font-bold"> Company </strong>

              <ul className="mt-6">
                  <Link
                  className="transition hover:text-white"
                    href="#"
                    >
                    <li>
                    About
                </li>
                  </Link>

                  <Link
                  className="transition hover:text-white"
                    href="/contact"
                    >
                    <li>
                    Contact
                </li>
                  </Link>

                  <Link
                    className="transition hover:text-white"
                    href="#"
                    >
                    <li>
                    Privacy & Terms
                </li>
                  </Link>

              </ul>
            </div>

            <div>
              <strong className="font-bold text-gray-300"> Product </strong>

              <ul className="mt-6 space-y-4">
                  <Link
                    className="transition hover:text-white"
                    href="/features"
                    >
                    <li>
                    Features
                </li>
                  </Link>

                  <Link
                    className="transition hover:text-white"
                    href="upgrade"
                    >
                    <li>
                    Pricing
                </li>
                  </Link>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-100 py-2">
          <p className="text-center text-xs/relaxed text-gray-400">
            © Company 2024. All rights reserved.
          </p>
            <p className="text-center text-xs/relaxed text-gray-400">Created with ❤️ By 
              
            <Link
              href="#"
              >
              <span> Nitin Saini</span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
