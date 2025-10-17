import { useState } from "react";

export default function Drawer({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (value: boolean) => void}) {

    return (
        <div className="drawer">
            {/* Hidden toggle input (no need to use it anymore) */}
            <input
                type="checkbox"
                className="drawer-toggle"
                checked={isOpen}
                readOnly
            />

            {/* <div className="drawer-content">
                <button
                    className="btn btn-primary"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Open drawer
                </button>
            </div> */}

            <div className="drawer-side">
                {/* Click overlay to close */}
                <label
                    className="drawer-overlay"
                    onClick={() => setIsOpen(false)}
                ></label>

                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content */}
                    <li>
                        <a>Sidebar Item 1</a>
                    </li>
                    <li>
                        <a>Sidebar Item 2</a>
                    </li>
                    {/* External Button */}
                    <li>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsOpen(false)}
                        >
                            Close Drawer
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
