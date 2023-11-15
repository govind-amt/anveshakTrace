"use client";
import React, {useEffect} from "react";
import '../login/login.css';
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';

function SignUpPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
        role: "",
        confirmPassword: ""
    })

    const [loading, setLoading] = React.useState(false);

    const [validationErrors, setValidationErrors] = React.useState({
        email: '',
        password: '',
        username: "",
        role: "",
        confirmPassword: ""
    });

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    useEffect(() => {
        sessionStorage.removeItem('access_token');
        localStorage.removeItem('roles');
    }, []);

    const onSignUp = async () => {
        setLoading(true);

        let errors = {
            email: '',
            password: '',
            username: "",
            role: "",
            confirmPassword: ""
        };

        if (!user.password.trim()) {
            errors.password = 'Password is required';
        }
        if (!user.confirmPassword.trim()) {
            errors.confirmPassword = 'Confirm Password is required';
        }
        if (user.confirmPassword.trim() != user.password.trim()) {
            errors.confirmPassword = 'Passwords does not match';
        }
        if (!user.email.trim()) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(user.email)) {
            errors.email = 'Please enter a valid email';
        }
        if (!user.username.trim()) {
            errors.username = 'Please enter a valid username';
        }
        if (!user.role.trim()) {
            errors.role = 'Please enter a valid role';
        }

        setValidationErrors(errors);

        if (errors.email || errors.password) {
            setLoading(false);
            return
        }

        // return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6776/api/';
            const responseData = await fetch(`${apiUrl}users/signUp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password,
                    username: user.username,
                    role: user.role,
                })
            });
            const response = await responseData.json();
            console.log("response", response)
            if (response.status == 201) {
                Swal.fire('Sign Up Successfull!',
                    'You will be navigated to login page',
                    'success').then((result) => {
                    if (result.value) {
                        // router.push('/login');
                        window.location.href = '/login';
                    }
                })
            } else if (!response.status == 200) {
                const message = `An error has occurred: ${response.statusText}`;
                await Swal.fire({
                    toast: true,
                    icon: "error",
                    iconColor: "#ffffff",
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    title: message,
                    customClass: {
                        popup: 'custom-background-color',
                        title: 'custom-text'
                    }
                })
            }

        } catch (error) {
            setLoading(false);
        }

    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSignUp();
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

            <div className="absolute" id="loginDivContent" style={{width: '30%', left:'35%', top: '6%', boxShadow: '0px 2px 8px 5px lightgrey', borderRadius: '0.5rem'}}>
                <div className="bg-white px-6  shadow sm:rounded-lg sm:px-12" style={{height: '88vh', paddingTop: '5px', paddingBottom:'5px'}}>
                    <h2 className="pt-4 font-sans text-center text-2xl font-bold leading-9 tracking-tight" style={{color: '#11644a'}}>
                        SIGN UP
                    </h2>
                    <form className="" action="#" method="POST">
                        <div style={{height: '13vh'}}>
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    required
                                    autoComplete="username"
                                    value={user.username} onChange={(e) => setUser({...user, username: e.target.value})}
                                    onKeyDown={handleKeyDown}
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {validationErrors.username &&
                                    <span
                                        className="flex justify-end text-red-500 text-xs mt-1.5 validationAlign" data-testid="password-validation-error">{validationErrors.username}</span>}
                            </div>
                        </div>


                        <div style={{height: '13vh'}}>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
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

                        <div style={{height: '13vh'}}>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={user.password} onChange={(e) => setUser({...user, password: e.target.value})}
                                    onKeyDown={handleKeyDown}
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {validationErrors.password &&
                                    <span
                                        className="flex justify-end text-red-500 text-xs mt-1.5 validationAlign" data-testid="password-validation-error">{validationErrors.password}</span>}
                            </div>
                        </div>

                        <div style={{height: '13vh'}}>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={user.confirmPassword} onChange={(e) => setUser({...user, confirmPassword: e.target.value})}
                                    onKeyDown={handleKeyDown}
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {validationErrors.confirmPassword &&
                                    <span
                                        className="flex justify-end text-red-500 text-xs mt-1.5 validationAlign" data-testid="password-validation-error">{validationErrors.confirmPassword}</span>}
                            </div>
                        </div>

                        <div style={{height: '13vh'}}>
                            <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                                Role
                            </label>
                            <div className="mt-1">
                                <select
                                    style={{height: '2.3rem'}}
                                    required
                                    placeholder="Select Role"
                                    value={user.role} onChange={(e) => setUser({...user, role: e.target.value})}
                                    onKeyDown={handleKeyDown}
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="" className="text-gray">Choose Role</option>
                                    <option value="producer">Producer</option>
                                    <option value="reseller">Reseller</option>
                                    <option value="retailer">Retailer</option>
                                </select>
                                {validationErrors.role &&
                                    <span
                                        className="flex justify-end text-red-500 text-xs mt-1.5 validationAlign" data-testid="password-validation-error">{validationErrors.role}</span>}
                            </div>
                        </div>

                        <div style={{height: '8vh', marginTop: '1rem'}}>
                            <button
                                type="submit"
                                onClick={onSignUp}
                                className="flex w-full justify-center rounded-md px-3 py-1 text-sm font-semibold leading-6 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 buttonChangess text-white"
                            >{loading && <div className="button-spinner mr-2"></div>}
                                Sign Up
                            </button>
                        </div>
                    </form>

                </div>
            </div>

        </div>

    )
}

export default SignUpPage;
