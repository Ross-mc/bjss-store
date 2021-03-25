import React, { useState } from "react";
import Header from "../../widgets/Header";
// import TodaysDeals from '../../components/containers/TodaysDeals';

export default () => {
    const [images, setImages] = useState([])
    const [resultsFromTextract, setResultsFromTextract] = useState({   
        orderNumber: "",
        item: "",
        unitPrice: "",
        subtotal: "",
        discount: "",
        tax: "",
        quantity: "",
        totalPrice: "",
    })

    const fileToDataUri = (image) => {
        return new Promise((res) => {
            const reader = new FileReader();
            const { type, name, size } = image;
            reader.addEventListener('load', () => {
                res({
                    base64: reader.result,
                    name: name,
                    type,
                    size: size,
                })
            });
            reader.readAsDataURL(image);
        })
    }

    const uploadImage = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImagesPromises = []
            for (let i = 0; i < e.target.files.length; i++) {
                newImagesPromises.push(fileToDataUri(e.target.files[i]))
            }
            const newImages = await Promise.all(newImagesPromises)
            setImages([...images, ...newImages])
            callTextract(newImages[0].base64)
            // callTextract(images[0].base64)
        }
        // e.target.value = "";
    }

    const callTextract = base64String => {
        //fetch(api end point)
        //process.env.TEXTRACT_KEY
        //
        console.log(base64String.substring(22))
        fetch("https://dfkz0dlc46.execute-api.eu-west-2.amazonaws.com/default/getTextFromImage", {
            method: "POST",
            body: JSON.stringify({
                "Image": base64String.substring(22)
            }),
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
            redirect: 'follow'
        }).then(res => res.json()).then(result => console.log(result))
    }

    //setResultsFromTextract({...resultsFromTextract, "<all the properties you want to change, i.e. quantity: >"})

    return (
        <div>
            <input type="file" onChange={uploadImage} multiple style={{marginTop: "20px", marginBottom: "20px"}}/>
            {
                images.length > 0
                    ? images.map((imageObj, i) => {
                        return (
                            <div style={{width: "80%", margin: "0 auto", textAlign: "center"}} key={i}>
                                <img
                                    style={{maxHeight: "400px", display:"inline"}}
                                    src={imageObj.base64}
                                    alt='uploadedImg'
                                />
                                <div>
                                    <span>{imageObj.size ? imageObj.size : '-'}</span>
                                    <span>{imageObj.name ? imageObj.name : '-'}</span>
                                </div>
                            </div>
                        )
                    })
                    : null
            }
            <div className={resultsFromTextract.totalPrice === "" ? "d-none" : "container"}>
                <ul className="list-group">
                    <li className="list-group-item">
                        Order Number : {resultsFromTextract.orderNumber}
                    </li>
                    <li className="list-group-item">
                        Item : {resultsFromTextract.item}
                    </li>
                    <li className="list-group-item">
                        Unit Price : {resultsFromTextract.unitPrice}
                    </li>
                    <li className="list-group-item">
                        Quantity : {resultsFromTextract.quantity}
                    </li>
                    <li className="list-group-item">
                        Sub-total : {resultsFromTextract.subtotal}
                    </li>
                    <li className="list-group-item">
                        Discount : {resultsFromTextract.discount}
                    </li>
                    <li className="list-group-item">
                        Tax : {resultsFromTextract.tax}
                    </li>
                    <li className="list-group-item">
                        Total Price : {resultsFromTextract.totalPrice}
                    </li>
                </ul>
                <button type="button" class="btn btn-danger">Submit Invoice</button>
            </div>
        </div>
    );
};
