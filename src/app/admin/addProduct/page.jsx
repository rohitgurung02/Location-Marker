"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';  // <-- Import toast
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
    const [image, setImage] = useState(null);  // Change initial value to null
    const [data, setData] = useState(
        {
            title: "",
            description: "",
            category: "Startup",
            author: "John Doe",
            authorImg: "/author_img.png"
        }
    )

    const [isClient, setIsClient] = useState(false); // State to check if we are on the client side

    useEffect(() => {
        // This will run only once on the client side
        setIsClient(true);
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    // Handle image selection
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    // Submit data logic with error handling
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('category', data.category);
            formData.append('author', data.author);
            formData.append('authorImg', data.authorImg);
            formData.append('image', image);  // Append the image file
            formData.append('timestamp', Date.now()); // Add timestamp for unique filenames

            const response = await axios.post('/api/blog', formData);

            if (response.data.success) {
                toast.success(response.data.msg);
                // Reset fields after successful submission
                setImage(null);
                setData({
                    title: "",
                    description: "",
                    category: "Startup",
                    author: "John Doe",
                    authorImg: "/author_img.png"
                });
            } else {
                toast.error("Error: " + response.data.msg);
            }
        } catch (error) {
            console.error("Error during submission:", error);
            toast.error("Error: " + error.response?.data?.message || error.message);
        }
    }

    return (
        <>
            <form onSubmit={onSubmitHandler} className='px-5 sm:pt-2 sm:pl-8'>

                <p className='text-base mt-4'>Longitude</p>
                <input type="text" name='longitude' onChange={onChangeHandler} value={data.longitude} placeholder='Enter text here'
                    className='w-full sm:w-[500px] mt-3 px-4 py-1 border' />

                <p className='text-base mt-4'>Latitude</p>
                <input type="text" name='latitude' onChange={onChangeHandler} value={data.latitude} placeholder='Enter text here'
                    className='w-full sm:w-[500px] mt-3 px-4 py-1 border' />

                <p className='text-base mt-4'>Potholes</p>
                <input type="text" name='potholes' onChange={onChangeHandler} value={data.potholes} placeholder='Enter text here'
                    className='w-full sm:w-[500px] mt-3 px-4 py-1 border' />

                <p className='text-base mt-4'>Animal Prone Areas</p>
                <input type="text" name='animalproneareas' onChange={onChangeHandler} value={data.animalproneareas} placeholder='Enter text here'
                    className='w-full sm:w-[500px] mt-3 px-4 py-1 border' />
                <br />
                <button type='submit' className='mt-6 w-36 h-10 border-radius bg-black text-white'>Add</button>
            </form>
        </>
    )
}

export default AddProduct;
