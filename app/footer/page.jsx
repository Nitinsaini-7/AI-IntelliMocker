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
    <footer className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-32">
          <div className="mx-auto max-w-sm lg:max-w-none">
            <Image src={"/logo.svg"} height={100} width={100}></Image>
            <p className="mt-4 text-center text-gray-500 lg:text-left lg:text-lg">
            Transform your interview skills with <span className="text-blue-500 font-bold">AI Mock Interviewer</span>.
            <br />
            Go-to the platform for personalized mock interviews, real-time feedback, and strategic tips to ace your career milestones
            </p>

            <div className="mt-6 flex justify-center gap-4 lg:justify-start">
              <ul className="col-span-2 flex justify-start gap-6 lg:col-span-5 lg:justify-end">
                <li>
                  <Link href={""}>
                    <div className="group w-11 h-11 flex items-center justify-center rounded-full bg-sky-500 hover:bg-white">
                      <FontAwesomeIcon
                        className="text-2xl text-white group-hover:text-black"
                        icon={faXTwitter}
                      />
                    </div>
                  </Link>
                </li>

                <li>
                  <Link href={""}>
                    <div className="group w-11 h-11 flex items-center justify-center rounded-full bg-sky-500 hover:bg-white">
                      <FontAwesomeIcon
                        className="text-2xl text-white group-hover:text-orange-500"
                        icon={faInstagram}
                      />
                    </div>
                  </Link>
                </li>

                <li>
                  <Link href={""}>
                    <div className="group w-11 h-11 flex items-center justify-center rounded-full bg-sky-500 hover:bg-white">
                      <FontAwesomeIcon
                        className="text-2xl text-white group-hover:text-blue-500"
                        icon={faFacebook}
                      />
                    </div>
                  </Link>
                </li>

                <li>
                  <Link href={""}>
                    <div className="group w-11 h-11 flex items-center justify-center rounded-full bg-sky-500 hover:bg-white">
                      <FontAwesomeIcon
                        className="text-2xl text-white group-hover:text-red-500"
                        icon={faEnvelope}
                      />
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 text-center lg:grid-cols-3 lg:text-left">
            <div>
              <strong className="font-medium text-gray-900"> Company </strong>

              <ul className="mt-6">
                  <Link
                    href="#"
                    >
                    <li>
                    About
                </li>
                  </Link>

                  <Link
                    href="#"
                    >
                    <li>
                    Contact
                </li>
                  </Link>

                  <Link
                    href="#"
                    >
                    <li>
                    Privacy & Terms
                </li>
                  </Link>

              </ul>
            </div>

            <div>
              <strong className="font-medium text-gray-900"> Product </strong>

              <ul className="mt-6 space-y-4">
                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75"
                    href="/features"
                    >
                    <li>
                    Features
                </li>
                  </Link>

                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75"
                    href="#"
                    >
                    <li>
                    Pricing
                </li>
                  </Link>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-100 pt-8">
          <p className="text-center text-xs/relaxed text-gray-500">
            © Company 2024. All rights reserved.
            <br />
            <p>Created with ❤️ By 
              
            <Link
              href="#"
              >
              <span> Nitin Saini</span>
            </Link>
          </p>
            .
          </p>
        </div>
      </div>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

    </footer>
  )
}

export default Footer;
