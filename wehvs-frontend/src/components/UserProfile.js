import React, { Component } from "react";
import withRouter from "./Router/withRouter";
import FooterMenu from "./Footer";
import axios from 'axios';

class UserProfile extends Component {
    constructor() {
        super();
        this.state = {
            userId: null,
            selectedCountry: null,
            selectedCity: null,
            countries: [
                { value: 'usa', label: 'USA' },
                { value: 'canada', label: 'Canada' }
            ],
            cities: [
                { value: 'new-york', label: 'New York', country: 'usa' },
                { value: 'los-angeles', label: 'Los Angeles', country: 'usa' },
                { value: 'toronto', label: 'Toronto', country: 'canada' },
                { value: 'vancouver', label: 'Vancouver', country: 'canada' },
            ],
            user: {
                firstName: "",
                lastName: "",
                email: "",
                contactEmail: "",
                telephone: "",
                dateOfBirth: "",
                address: "",
                country: "",
                city: "",
                province: "",
                zipCode: "",
                mobileNumber: ""
            },
            firstNameError: "",
            lastNameError: "",
            telephoneError: "",
            dateOfBirthError: "",
            addressError: "",
            errors: null,
            loading: false // Change it to true while getting data from API
        };
    }

    componentDidMount() {
        // Retrieve user ID and role from localStorage
        const userId = localStorage.getItem('userId');

        // Set the userId in the component's state
        this.setState({ userId });

        // Make an API request to get the user data
        axios.get(`http://localhost:3333/users/getById/${userId}`)
            .then(response => {

                const user = { ...response.data.data };
                user.dateOfBirth = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "";
                if (user.addressId) {
                    user.address = user.addressId.address;
                    user.country = user.addressId.country;
                    user.city = user.addressId.city;
                    user.province = user.addressId.province;
                    user.zipCode = user.addressId.zipCode;
                }
                if (user.contactId) {
                    user.telephone = user.contactId.telephone;
                    user.contactEmail = user.contactId.contactEmail;
                }

                // Set the state with the fetched user data
                this.setState({ user });
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
    }

    validateUser = (e) => {
        e.preventDefault();

        const {
            firstName,
            lastName,
            dateOfBirth,
            telephone,
            address } = this.state.user;

        let valid = true;

        // First name validation
        if (firstName === "") {
            this.setState({ firstNameError: "First Name is required" });
            valid = false;
        } else {
            this.setState({ firstNameError: "" });
        }

        // Last name validation
        if (lastName === "") {
            this.setState({ lastNameError: "Last Name is required" });
            valid = false;
        } else {
            this.setState({ lastNameError: "" });
        }

        // Telephone validation
        if (telephone === "") {
            this.setState({ telephoneError: "Telephone is required" });
            valid = false;
        } else {
            this.setState({ telephoneError: "" });
        }


        // Date of Birth validation
        if (dateOfBirth === "") {
            this.setState({ dateOfBirthError: "Date of Birth is required" });
            valid = false;
        } else {
            // Convert the date from yyyy-mm-dd format to a Date object
            const dateOfBirthDate = new Date(dateOfBirth + "T00:00:00.000Z");

            if (dateOfBirthDate != undefined && isNaN(dateOfBirthDate.getTime())) {
                this.setState({ dateOfBirthError: "Invalid Date of Birth" });
                valid = false;
            } else {
                this.setState({ dateOfBirthError: "" });
            }
        }

        // Address validation
        if (address === "") {
            this.setState({ addressError: "Address is required" });
            valid = false;
        } else {
            this.setState({ addressError: "" });
        }

        // Address validation
        if (address === "") {
            this.setState({ addressError: "Address is required" });
            valid = false;
        } else {
            this.setState({ addressError: "" });
        }

        if (valid) {
            this.handleSubmit();
        }
    };

    handleSubmit = async () => {
        const {
            firstName,
            lastName,
            dateOfBirth,
            address,
            country,
            city,
            province,
            zipCode,
            telephone,
            mobileNumber,
            contactEmail } = this.state.user;

        // Retrieve userId from the component's state
        const userId = this.state.userId;

        try {
            const response = await axios.put('http://localhost:3333/users/update/' + userId, {
                firstName,
                lastName,
                dateOfBirth,
                address,
                country,
                city,
                province,
                zipCode,
                telephone,
                mobileNumber,
                contactEmail
            });

            if (response.data.statusCode === 200) {
                this.setState({ successMessage: "User updated successfully!" });
            } else {
                this.setState({ errorMessage: "Invalid data provided" });
            }
        } catch (error) {
            this.setState({ errorMessage: "Something went wrong, please try again!" });
        }
    };


    handleCountryChange = (selectedOption) => {
        this.setState({ selectedCountry: selectedOption, selectedCity: null });
    };

    handleCityChange = (selectedOption) => {
        this.setState({ selectedCity: selectedOption });
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;

        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                [name]: value,
            },
            dateOfBirthError: "", // Clear date of birth error when other fields change
        }));
    };

    render() {
        const { user, loading } = this.state;
        const { errorMessage,
            successMessage,
            firstNameError,
            lastNameError,
            telephoneError,
            dateOfBirthError,
            addressError } = this.state;

        return (
            <div>
                {/* CONTENT */}
                <div className="row container">
                    <div className="col-lg-12">

                        {loading ? (
                            <p className="loading">Loading user data...</p>
                        ) : (

                            <form className="form-contact contact_form" method="post" id="contactForm" onSubmit={this.validateUser}>
                                {errorMessage && (
                                    <div className="alert alert-danger" role="alert" bis_skin_checked="1">
                                        {errorMessage}
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="alert alert-success" role="alert" bis_skin_checked="1">
                                        {successMessage}
                                    </div>
                                )}

                                <div className="col-12">
                                    <h2 className="contact-title">User Profile</h2>
                                </div>


                                <div className="row">
                                    <div className="col-md-3 border-right">
                                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                            <img className="rounded-circle " width="150px" src="/images/user.png"></img>
                                            <button type="submit" className="button button-contactForm btn-change-picture boxed-btn mt-4">Change Profile</button>

                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="row">

                                            <div className="col-sm-6  mt-4">
                                                <label htmlFor="firstName">First Name</label>
                                                <input className={`form-control ${firstNameError && "is-invalid"}`} name="firstName" id="firstName" type="text" placeholder="First Name" onChange={this.handleInputChange} defaultValue={user.firstName} />
                                                {firstNameError && <div className="invalid-feedback"><span className="text-danger float-left">{firstNameError}</span></div>}
                                            </div>
                                            <div className="col-sm-6 mt-4">
                                                <label htmlFor="lastName">Last Name</label>
                                                <input className={`form-control ${lastNameError && "is-invalid"}`} name="lastName" id="lastName" type="text" placeholder="Last Name" onChange={this.handleInputChange} defaultValue={user.lastName} />
                                                {lastNameError && <div className="invalid-feedback"><span className="text-danger float-left">{lastNameError}</span></div>}
                                            </div>
                                            <div className="col-sm-6  mt-4">
                                                <label htmlFor="email">Email</label>
                                                <input className="form-control valid" name="email" id="email" type="text" placeholder="Email" defaultValue={user.email} disabled />
                                            </div>
                                            <div className="col-sm-6 mt-4">
                                                <label htmlFor="telephone">Telephone</label>
                                                <input className={`form-control ${telephoneError && "is-invalid"}`} name="telephone" id="telephone" type="text" placeholder="Telephone" onChange={this.handleInputChange} defaultValue={user.telephone} />
                                                {telephoneError && <div className="invalid-feedback"><span className="text-danger float-left">{telephoneError}</span></div>}
                                            </div>
                                            <div className="col-sm-6 mt-4">
                                                <label htmlFor="dateOfBirth">Date of Birth</label>
                                                <input className={`form-control ${dateOfBirthError && "is-invalid"}`} name="dateOfBirth" id="dateOfBirth" type="date" placeholder="Select Date of Birth" onChange={this.handleInputChange} defaultValue={user.dateOfBirth} />
                                                {dateOfBirthError && <div className="invalid-feedback"><span className="text-danger float-left">{dateOfBirthError}</span></div>}
                                            </div>
                                            <div className="col-12 mt-6 contact-info">
                                                <h5>Contact Information</h5>
                                            </div>

                                            <div className="col-sm-6  mt-4">
                                                <label htmlFor="address">Address</label>
                                                <input className={`form-control ${addressError && "is-invalid"}`} name="address" id="address" type="text" placeholder="Address" onChange={this.handleInputChange} defaultValue={user.address} />
                                                {addressError && <div className="invalid-feedback"><span className="text-danger float-left">{addressError}</span></div>}
                                            </div>

                                            <div className="col-sm-6  mt-4">
                                                <label htmlFor="country">Country</label>
                                                <input className="form-control valid" name="country" id="country" type="text" placeholder="Country" defaultValue={user.country} />
                                            </div>

                                            <div className="col-sm-6  mt-4">
                                                <label htmlFor="city">City</label>
                                                <input className="form-control valid" name="city" id="city" type="text" placeholder="City" defaultValue={user.city} />
                                            </div>

                                            <div className="col-sm-6  mt-4">
                                                <label htmlFor="province">Province</label>
                                                <input className="form-control valid" name="province" id="province" type="text" placeholder="Province" defaultValue={user.province} />
                                            </div>

                                            <div className="col-sm-6  mt-4">
                                                <label htmlFor="zipCode">Zip Code</label>
                                                <input className="form-control valid" name="zipCode" id="zipCode" type="text" placeholder="Zip Code" defaultValue={user.zipCode} />
                                            </div>

                                        </div>
                                    </div>
                                </div>


                                <div className="col-12 form-group mt-5">
                                    <button type="submit" className="button button-contactForm button-submit boxed-btn">Send</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
                {/* FOOTER */}
                <FooterMenu />
            </div>
        );
    }
}

export default withRouter(UserProfile);
