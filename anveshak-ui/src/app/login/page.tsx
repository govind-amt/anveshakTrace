"use client";
import React, {useEffect} from "react";
import './login.css';
import Swal from "sweetalert2";

function LoginPage() {
    const [user, setUser] = React.useState({
        email: "",
        password: ""
    })

    const [loading, setLoading] = React.useState(false);

    const [validationErrors, setValidationErrors] = React.useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        sessionStorage.removeItem('access_token');
        localStorage.removeItem('roles');
    }, []);

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const onLogin = async () => {
        setLoading(true);

        let errors = {
            email: '',
            password: ''
        };

        if (!user.password.trim()) {
            errors.password = 'Password is required';
        }
        if (!user.email.trim()) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(user.email)) {
            errors.email = 'Please enter a valid email';
        }

        setValidationErrors(errors);

        if (errors.email || errors.password) {
            setLoading(false);
            return
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6776/api/';
            const response = await fetch(`${apiUrl}users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password
                })
            });
            const responseData = await response.json();
            if (responseData.status === 200) {
                sessionStorage.setItem('access_token', responseData.access_token);
                localStorage.setItem('roles', responseData.role);
                window.location.href = '/dashboard';
            } else if (responseData.statusCode === 404) {
                setLoading(false);
                await Swal.fire({
                    toast: true,
                    icon:"error",
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    title: 'User does not exist',
                    customClass: {
                        popup: 'custom-background',
                        title: 'custom-text-color'
                    }
                })
            } else if (responseData.status === 401) {
                setLoading(false);
                await Swal.fire({
                    toast: true,
                    icon:"error",
                    iconColor:"#ffffff",
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    title: 'Invalid credentials',
                    customClass: {
                        popup: 'custom-background',
                        title: 'custom-text-color'
                    }
                })
            } else {
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }

    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onLogin();
        }
    }

    return (
        <div className="flex flex-1" style={{minHeight: '100vh'}}>
            <img
                className="absolute inset-0 h-full w-full object-cover"
                src="./backgroundOne.jpg"
                alt=""
            />
            <div className="relative hidden w-0 flex-1 lg:block">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="./backgroundFive.jpg"
                    alt=""
                />
                <img
                    className="absolute inset-0 h-full w-full object-cover" style={{opacity: '0.5'}}
                    src="./newLogo.png"
                    alt=""
                />
            </div>

            <div className="flex flex-1 flex-col justify-center " style={{background: 'white', width: '50%', height: '100vh'}}>
                <img
                    className=" inset-0 h-full w-full object-cover" style={{opacity: '0.8'}}
                    src="./newSmallLogo.png"
                    alt=""
                />
            </div>

            <div className="absolute" id="loginDivContent" style={{width: '30%', left:'35%', top: '16%', boxShadow: '0px 2px 8px 5px lightgrey', borderRadius: '0.5rem'}}>
                <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12" style={{height: '68vh'}}>
                    <h2 className="font-sans text-center text-2xl font-bold leading-9 tracking-tight" style={{color: '#11644a'}}>
                        LOGIN
                    </h2>
                    <form className=" mt-8" action="#" method="POST">
                        <div style={{height: '15vh'}}>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    data-testid="email"
                                    type="text"
                                    required
                                    autoComplete="email"
                                    value={user.email} onChange={(e) => setUser({...user, email: e.target.value})}
                                    onKeyDown={handleKeyDown}
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {validationErrors.email &&
                                    <span
                                        className="flex justify-end text-red-500 text-xs mt-1.5 validationAlign" data-testid="email-validation-error">{validationErrors.email}</span>}
                            </div>
                        </div>

                        <div style={{height: '15vh'}}>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    data-testid="password-input"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={user.password} onChange={(e) => setUser({...user, password: e.target.value})}
                                    onKeyDown={handleKeyDown}
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {validationErrors.password &&
                                    <span
                                        className="flex justify-end text-red-500 text-xs mt-1.5 validationAlign" data-testid="password-validation-error">{validationErrors.password}</span>}
                            </div>
                        </div>

                        <div style={{height: '8vh'}} className="mt-1">
                            <button
                                type="submit"
                                onClick={onLogin}
                                className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 buttonChangess text-white"
                            >{loading && <div className="button-spinner mr-2"></div>}
                                Login
                            </button>
                        </div>
                    </form>

                </div>
            </div>

        </div>

    )
}

export default LoginPage;
