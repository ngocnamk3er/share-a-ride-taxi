import React, { useState } from "react";
import SearchBox from "./SearchBox";
import Map from "./Map";

function SearchLocation(props) {
    const { position, setPosition } = props;
    const [selectPosition, setSelectPosition] = useState(position ? {lat : position[0], lon : position[1]} : null);
    const { onClose } = props
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                margin: "auto",
                width: "80vw",
                height: "80vh",
                backgroundColor: "#fff",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                padding: "20px",
            }}
        >
            <button
                style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "red",
                }}
                onClick={() => {
                    if (selectPosition != null) {
                        setPosition(selectPosition);
                    }
                    onClose();
                }}
            >
                Close
            </button>
            <div style={{ display: "flex", flexDirection: "row", width: "100%", height: "100%" }}>
                <div style={{ width: "50%", height: "100%" }}>
                    <Map position={position} selectPosition={selectPosition} />
                </div>
                <div style={{ width: "50%", marginLeft: "20px" }}>
                    <SearchBox selectPosition={selectPosition} setSelectPosition={setSelectPosition} />
                </div>
            </div>
        </div>
    );
}

export default SearchLocation;
