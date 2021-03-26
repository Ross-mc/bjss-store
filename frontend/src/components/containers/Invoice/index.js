import React, { useState } from "react";
import Header from "../../widgets/Header";
// import TodaysDeals from '../../components/containers/TodaysDeals';

export default () => {
    const [images, setImages] = useState([])
    const [formState, setFormState] = useState({
        "quantity": "",
        "item #": "",
        "description": "",
        "unit price": "",
        "discount": "",
        "line total": "",
        "total discount": "",
        "subtotal": "",
        "sales tax": "",
        "total": ""
    })
    const [resultsFromTextract, setResultsFromParsedTextract] = useState({
        "quantity": "",
        "item #": "",
        "description": "",
        "unit price": "",
        "discount": "",
        "line total": "",
        "total discount": "",
        "subtotal": "",
        "sales tax": "",
        "total": ""
    })
    const [formSubmitted, setFormSubmitted] = useState(false)

    const onChangeHandler = (event) => {
        event.preventDefault();
        const value = event.target.value;
        const elemToUpdate = event.target.name;
        const stateObject = {...formState};
        stateObject[elemToUpdate] = value;
        setFormState(stateObject)
    }


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
        }).then(res => res.json()).then(result => {
            const parsedResult = parseText(result);
            setResultsFromParsedTextract({...resultsFromTextract, ...parsedResult})
            setFormState(parsedResult)
        })
    }

    const parseText = text => {
        // returns an object having read the returned string from aws lambda/textract
        let dataArray = text.split('\n')
        let quantityIndex;
        let keepChecking = true
        dataArray.forEach((item, index) => {
            if(parseInt(item) > 0 && keepChecking) {
                quantityIndex = index
                keepChecking = false
            }
        })

        dataArray = text.split('\n').splice(quantityIndex, 14)

        let dataAr = {
            "quantity": dataArray[0],
            "item #": dataArray[1],
            "description": dataArray[2],
            "unit price": dataArray[3].substring(1),
            "discount": dataArray[4],
            "line total": dataArray[5],
            "total discount": dataArray[7],
            "subtotal": dataArray[9],
            "sales tax": dataArray[11],
            "total": dataArray[13],
        }
        return dataAr
    }

    const submitInvoiceHandler = async event => {
        event.preventDefault();
        // make api call to backend to submit the data, then display successful response on frontend
        // clear form using below func
        console.log(formState)
        await setTimeout(() => {
            setFormState({
                "quantity": "",
                "item #": "",
                "description": "",
                "unit price": "",
                "discount": "",
                "line total": "",
                "total discount": "",
                "subtotal": "",
                "sales tax": "",
                "total": ""
            });
            setFormSubmitted(true);
            
        }, 1000)
        setTimeout(() => {
            setFormSubmitted(false)
        }, 2500)
    }

    //setResultsFromTextract({...resultsFromTextract, "<all the properties you want to change, i.e. quantity: >"})

    return (
        <div style={{marginBottom: "30px"}}>
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
            <small id="formHelp" class="form-text text-muted">Upload an image of an invoice or manually enter details below.</small>
            <form onSubmit={submitInvoiceHandler} className="container">
                    {Object.entries(formState).map(([key, value]) => {
                        // console.log(Object.entries(formState))
                        return (
                            <div className="form-group">
                                <label for={key}>{key}</label>
                                <input name={key} type="text" className="form-control" value={value} onChange={onChangeHandler}/>
                                <br></br>
                            </div>
                        )
                    })}
                <small id="formHelp" class="form-text text-muted">Please confirm all invoice details before submission</small>
                <br />
                <div className={formSubmitted ? "alert alert-success": "d-none"} role="alert">
                    Successfuly saved invoice to database
                </div>
                <button type="submit" className="btn btn-danger">Submit Invoice</button>

            </form>
        </div>
    );
};
