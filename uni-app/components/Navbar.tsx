// export default function Navbar() {
//     return (
//         <div className="navbar bg-base-100 shadow-sm fixed top-0 left-0 z-20 text-primary-content">
//             <div className="navbar-start">
//                 <div className="dropdown">
//                     <div
//                         tabIndex={0}
//                         role="button"
//                         className="btn btn-ghost lg:hidden"
//                     >
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-5 w-5"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                         >
//                             {" "}
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M4 6h16M4 12h8m-8 6h16"
//                             />{" "}
//                         </svg>
//                     </div>
//                     <ul
//                         tabIndex={0}
//                         className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
//                     >
//                         <li>
//                             <a>Home</a>
//                         </li>
//                         <li>
//                             <a>Search</a>
//                         </li>
//                         <li>
//                             <a>Categories</a>
//                             <ul className="p-2">
//                                 <li>
//                                     <a>Movies</a>
//                                 </li>
//                                 <li>
//                                     <a>Series</a>
//                                 </li>
//                                 <li>
//                                     <a>Anime</a>
//                                 </li>
//                             </ul>
//                         </li>
//                         <li>
//                             <a>Popular</a>
//                         </li>
//                     </ul>
//                 </div>
//                 <a className="btn btn-ghost text-xl hidden lg:inline-flex">SRT Editor</a>
//             </div>
//             <div className="navbar-center lg:hidden">
//                 <a className="btn btn-ghost text-xl">SRT Editor</a>
//             </div>
//             <div className="navbar-end hidden lg:flex">
//                 <ul className="menu menu-horizontal px-1">
//                     <li>
//                         <a>Home</a>
//                     </li>
//                     <li>
//                         <a>Search</a>
//                     </li>
//                     <li>
//                         <details>
//                             <summary>Categories</summary>
//                             <ul className="p-2">
//                                 <li>
//                                     <a>Movies</a>
//                                 </li>
//                                 <li>
//                                     <a>Series</a>
//                                 </li>
//                                 <li>
//                                     <a>Anime</a>
//                                 </li>
//                             </ul>
//                         </details>
//                     </li>
//                     <li>
//                         <a>Popular</a>
//                     </li>
//                 </ul>
//             </div>
//         </div>
//     );
// }


import { useAuth } from "context/AuthProvider";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                setIsVisible(false); // Hide when scrolling down
            } else {
                setIsVisible(true); // Show when scrolling up
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <div
            className={`navbar bg-base-100 shadow-sm fixed top-0 left-0 z-20 text-primary-content w-full transition-transform duration-300 ${
                isVisible ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <div className="navbar-start">
                <div className="dropdown">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost lg:hidden"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                    >
                        <li>
                            <Link to={"/"}>Editor</Link>
                        </li>
                        {user ? (
                            <>
                                <li>
                                    {/* <a href="/dashboard">Dashboard</a> */}
                                    <Link to={"/dashboard"}>Dashboard</Link>
                                </li>
                                <li>
                                    <a onClick={logout} className="font-bold">
                                        Logout
                                    </a>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to={"/login"}>Login</Link>
                                </li>
                                <li>
                                    <Link to={"/login?signup=true"}>Signup</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl hidden lg:inline-flex">
                    SRT Editor
                </a>
            </div>
            <div className="navbar-center lg:hidden">
                <a className="btn btn-ghost text-xl">SRT Editor</a>
            </div>
            <div className="navbar-end hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link to={"/"}>Editor</Link>
                    </li>
                    {user ? (
                        <>
                            <li>
                                <Link to={"/dashboard"}>Dashboard</Link>
                            </li>
                            <li>
                                <a onClick={logout} className="font-bold">
                                    Logout
                                </a>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to={"/login"}>Login</Link>
                            </li>
                            <li>
                                <Link to={"/login?signup=true"}>Signup</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}

