import React, { useState } from "react";
import Header from "../../widgets/Header";
// import TodaysDeals from '../../components/containers/TodaysDeals';

export default () => {
    const [images, setImages] = useState([])

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
        fetch("https://ay5sr2g1w1.execute-api.eu-west-2.amazonaws.com/default/getTextFromImage", {
            method: "POST",
            body: {
                "Image": base64String.substring(22)
            },
            headers: {
                "x-api-key": "YnkehjXECg669fNaBEErV6optvKhvRBXaXbJXf4Y",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"

            }
        }).then(res => res.json()).then(result => console.log(result))
    }

    return (
        <div>
            <input type="file" onChange={uploadImage} multiple />
            {
                images.length > 0
                    ? images.map((imageObj, i) => {
                        return (
                            <div key={i}>
                                <img
                                    width="50"
                                    src={imageObj.base64}
                                    alt=''
                                />
                                <div>
                                    <span>{imageObj.size ? imageObj.size : '-'}</span>
                                    <span>{imageObj.name ? imageObj.name : '-'}</span>
                                    {/* <span
                                onClick={() => removeImage(i)}
                            >
                                test
                            </span> */}
                                </div>
                            </div>
                        )
                    })
                    : null
            }
        </div>
    );
};
