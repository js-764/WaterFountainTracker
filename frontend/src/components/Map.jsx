import { MapContainer, TileLayer, useMap, Marker, Popup, Polyline, GeoJSON } from 'react-leaflet'
import { Icon } from "leaflet"
import 'leaflet/dist/leaflet.css'
import "../css/Map.css"
import {useState, useEffect} from 'react'
import UpdateModal from "../components/UpdateModal"

import axios from "axios"

function Map() {

    //---------- Getting the fountain data ---------

    //making array for fountain data
    const [array, setArray] = useState([])

    // function to call for the data and make the array hold the data
    const fetchAPI = async () => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        try {
            const response = await axios.get(`${baseUrl}/api`)
            
            if (Array.isArray(response.data.fountains)) {
                setArray(response.data.fountains)
            } else {
                console.error("Error with fountain data format:",data.response)
            }
        }

        catch (error) {
            console.error("Error getting the data",error)
        }

    }

    //when the page starts up, call the call-for-the-data function once
    useEffect(() => {
      fetchAPI()
    }, [])

    //---------- Getting the fountain data ---------




    //---------- Prepping the state markers ---------

    //When fountain is broken, icon will be red
    const redBrokenIcon = new Icon({
                            iconUrl: "https://cdn-icons-png.flaticon.com/128/5583/5583006.png",
                            iconSize: [38,38]
                        })

    //When fountain is obstructed, icon will be orange
    const orangeObstructedIcon = new Icon({
                            iconUrl: "https://cdn-icons-png.flaticon.com/128/7987/7987535.png",
                            iconSize: [35,35]
                        })

    //When fountain is good, icon will be green
    const greenGoodIcon = new Icon({
                            iconUrl: "https://cdn-icons-png.flaticon.com/128/8944/8944264.png",
                            iconSize: [38,38]
                        })

    //When fountain is dirty, icon will be black
    const blackDirtyIcon = new Icon({
                            iconUrl: "https://cdn-icons-png.flaticon.com/128/12535/12535971.png",
                            iconSize: [38,38]
                        })

    //When fountain has snow-related-issue, icon will be blue
    const winterBlueIcon = new Icon({
                            iconUrl: "https://cdn-icons-png.flaticon.com/128/7987/7987463.png",
                            iconSize: [34,34]
                        })

    //---------- Prepping the state markers ---------




    //---------- Highlighting the trail on the map ---------

    // //Here, I wanted to highlight the map trail with a bright color to show users where the trail is
    // //in case they may have never seen it before or maybe even just for people's convinience
    // //so I started trying to draw out the trail with these polylines, but uhmmmmm it's taking a long time.
    // //I figure there's a faster way, but I don't know of it yet. I still have to think about it :.)
    // const multiPolyline = [
    //     //Instructions for myself to remember how to plot the polyline coords
    //     //y first, then x
    //     // higher the y #, point goes up
    //     // higher the x #, point goes left
    //     [39.963, -75.181],
    //     [39.964, -75.1823],
    //     [39.9644, -75.1827],
    //     [39.9649, -75.1827],
    //     [39.9655, -75.1832],
    //     [39.9658, -75.1831],
    //     [39.9662, -75.1831],
    //     [39.9672, -75.1834],
    // ]

    // //The color I chose to highlight the trail
    // const trailColor = { color: 'blue' }

    //---------- Highlighting the trail on the map ---------




    //---------- Modal Logic For Submitting Updates ---------

    // variable to identify which fountain is being updated
    const [selectedFountain, setSelectedFountain] = useState("")

    // variable to keep track of modal's visability
    const [showModal, setShowModal] = useState(false)

    // This array is for the modals to prevent any back-to-back duplicate status updates
    // This array is used in the bottommost return statement for rendering the modal component
    const fountainStatuses = ["Dirty", "Obstructed", "Good", "Broken/Not Working", "Snow/Ice Blocking Access"]



    // Whenever showModal changes (to true or false) re-render
    // the page to show the change (of opening/closing the modal)
    useEffect(() => {}, [showModal])

    // When the user clicks on the "update" button on the marker, open the modal
    function openModal() {
        if (!showModal) {
            setShowModal(true)
        }
    }

    //If the user clicks the x button when the modal is open, close the modal
    function closeModal() {
        if (showModal) {
            setShowModal(false)
        }
    }

    //---------- Modal Logic For Submitting Updates ---------




    //As long as the water fountain info array isn't empty (from the fetchAPI function at the top), return the map
    if (array) {

        return(<>
    
            <div className="map">
                <MapContainer center={[39.963, -75.183]} zoom={13} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    {/* Trail path that I'm highlighting: it's blue */}
                    {/* <Polyline pathOptions={trailColor} positions={multiPolyline} /> */}


                    {/* .map() function to make a marker for each fountain */}
                    {array.map((fountain, index) => {


                        {/* Here, identify which fountain status matches the corresponding status marker colors available. Start with green */}
                        let markerIcon = greenGoodIcon
                        
                        if (fountain.fountain_status === "Dirty") {
                            markerIcon = blackDirtyIcon
                        } else if (fountain.fountain_status === "Obstructed") {
                            markerIcon = orangeObstructedIcon
                        } else if (fountain.fountain_status === "Broken/Not Working") {
                            markerIcon = redBrokenIcon
                        } else if (fountain.fountain_status === "Snow/Ice Blocking Access") {
                            markerIcon = winterBlueIcon
                        }


                        return (<>
                            {/* Here is where each fountain actually displays its marker on the map & its fountain info is added to the hidden popup */}
                            <Marker position = 
                                {[parseFloat(fountain.location_Y), parseFloat(fountain.location_X)]}
                                icon={markerIcon}
                                key={fountain.id} >

                                <Popup key={fountain.id}>
                                          <p className="popUpInfo"> <span className="boldText">{fountain.fountain_name}</span> </p>
                                    <br /><p className="popUpInfo"> <span className="boldText">Status: </span> {fountain.fountain_status} </p>
                                    <br /><p className="popUpInfo"> <span className="boldText">Description: </span> "{fountain.fountain_desc}" </p>
                                    <br /><p className="popUpInfo"> <span className="boldText">Photo: </span><br /> <img src={fountain.image_url} alt="Fountain image"></img> </p>
                                    <br /><p className="popUpInfo"> <span className="boldText">Last updated: </span> {(fountain.fountain_date).slice(5,7)+"-"
                                                                                                                     +(fountain.fountain_date).slice(8,10)+"-"
                                                                                                                     +(fountain.fountain_date).slice(0,4)} </p>

                                    <br /><button
                                            className="beginUpdateBtn"
                                            onClick={() => {
                                                        setSelectedFountain(fountain);
                                                        openModal()
                                        }}>Update</button>

                                </Popup>
                            </Marker>

                            {/* If showModal is true, return the modal */}
                            {showModal && (
                                <UpdateModal
                                    fountain={selectedFountain}
                                    statuses={fountainStatuses}
                                    closeModal={() => setShowModal(false)}
                                    fetchAPI={() => fetchAPI()}
                                />
                            )}
                            
                        </>)

                    })}


                </MapContainer>
            </div>
        </>)
    }

}

export default Map





// const API_KEY = "";
// const BASE_URL = "https://api.themoviedb.org/3";

// export const getPopularMovies = async () => {
//     const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
//     const data = await response.json();
//     return data.results
// }

// export const searchMovies = async (query) => {
//     const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
//     const data = await response.json();
//     return data.results
// }
