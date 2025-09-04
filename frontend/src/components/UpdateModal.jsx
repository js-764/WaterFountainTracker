import {useState, useEffect} from 'react'
import "../css/UpdateModal.css"
import axios from "axios"

function UpdateModal({ fountain, statuses, closeModal, fetchAPI }) {

    //Get the current date for the "Status was Last Updated at [this] time" fountain data
    const date = new Date()

    const currentDate = date.getFullYear().toString() + "-"
                     + (date.getMonth()+1).toString().padStart(2, '0') + "-"
                     + date.getDate().toString().padStart(2, '0')


    // The 3 values we're getting
    const [status, setStatus] = useState()
    const [desc, setDesc] = useState("")
    const [img, setImg] = useState()


    //function for the submitted form
    function handleSubmit(event) {
        event.preventDefault()

        const baseUrl = process.env.REACT_APP_API_BASE_URL;

        axios.put(`${baseUrl}/update/:${fountain.fountain_id}`, {
            id: fountain.fountain_id,
            fountain_status:status,
            fountain_desc:desc || "[No Description Provided]",
            fountain_date:currentDate,
            image_url: img || "[No Image Provided]"
        })
        
        //close modal, refetch the new fountain data
        closeModal()
        fetchAPI()
    }


    //Upon any user changes to these 3 data fields, immediately make the user's change the new field's value
    function handleDescChange(event) {
        setDesc(event.target.value)
    }

    function handleStatusChange(event) {
        setStatus(event.target.value)
    }

    function handleImgChange(event) {
        setImg(event.target.value)
    }


    //This is to set the status variable to be whatever the first option in the dropdown of the modal
    // so that the dropdown always has a value/doesn't have to wait for the user to make a change
    function defaultStatus() {
        setStatus(statuses.filter(s => s !== fountain.fountain_status)[0])
    }

    //GIve the status a value immediately
    useEffect(()=>{
        defaultStatus()
    },[])


    //Prepare and return this modal for the rerender
    return(<>
        <div id="myModal" className="modal">
            <div className="modal-content">
                
                <span className="close" onClick={closeModal}>&times;</span> {/* Onclick function here to close modal (&times; is an x) */}

                <form onSubmit={handleSubmit}>
                    {/* Place for users to select the status from the dropdown */}
                    <label htmlFor="statuses">Select a new status:</label>
                    <select name="statuses" id="statuses" onChange={handleStatusChange} value={status}>

                        {/* Compare each status in the array to whatever this fountain's status is */}
                        {/* And choose not to show it if they match */}
                        {statuses.filter(s => s !== fountain.fountain_status).map(s => (
                            <option key={s}>{s}</option>
                        ))}

                    </select><br/><br/>

                    {/* Place for users to add a short description */}
                    <label htmlFor="desc" maxlength="50">Add a short description (optional):</label><br/>
                    <input type="text" id="desc" name="desc" value={desc} onChange={handleDescChange}></input><br/><br/>

                    {/* Place for users to upload a photo */}
                    <label htmlFor="img">Enter image URL (optional):</label><br />
                    <input type="text" id="img" name="img" accept="image/*" onChange={handleImgChange}></input><br />
                    
                    <input type="submit"></input>
                </form>
            </div>
        </div>
    </>)

}

export default UpdateModal