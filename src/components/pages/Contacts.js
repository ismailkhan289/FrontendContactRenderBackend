import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label,
        Input,Row, Badge, CardText, Card, CardBody, CardTitle } from 'reactstrap';
import { UserContext } from '../coreComp/UserContext';
    
    const Contacts = () => {
        const getCsrfToken = () => {
            return document.cookie.split(';').find(row=>row.startsWith('XSRF-TOKEN')).split('=')[1] || '';
           }
        const {authenticated} = useContext(UserContext);
        const [contacts, setContacts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [modal, setModal] = useState(false);
        const initialNewContactValues= {
            name: '',
            email: '',
            title: '',
            status: '',
            address: ''
        };      
        
        const [photoFile, setPhotoFile] = useState(null);
        const [newContact, setNewContact] = useState(initialNewContactValues);
        
        const toggle = () => setModal(!modal);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setNewContact({ ...newContact, [name]: value });
        };
        const handleFileChange = (e) => {
            setPhotoFile(e.target.files[0]);
        };

      const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("contact", new Blob([JSON.stringify(newContact)], { type: "application/json" }));
        if (photoFile) {
            formData.append("photo", photoFile);
        }
        //send a POST request to the server
        await fetch(`${process.env.REACT_APP_API_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken() // ✅ CSRF Token Add
            },
            credentials: 'include',
            body: formData
        })
        //parse the response
        .then(response => response.json())
        .then(data => {
            setContacts([...contacts, data]);
            setNewContact(initialNewContactValues);
            setPhotoFile(null);
            setLoading(false);
            toggle();   
        })
        .catch(error => console.error('Error adding contact:', error));
    }
    // Function to fetch contact details & open modal
    const toggleAndFetch = async (event,id) => {
        event.preventDefault();
        setLoading(true);
        try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact/${id}`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error("Failed to fetch contact");
        const data = await response.json();
        setNewContact(data);  // ✅ Store fetched contact
        } catch (error) {
        console.error("Error fetching contact:", error);
        } finally {
        setLoading(false);
        setModal(true);  // ✅ Open modal
        }
    }
    // Function to close modal & reset form
    const handleCancel = () => {
        setNewContact(initialNewContactValues);
        toggle();
    };
    // Function to Edit and update contact details
    const myContactEditUpdate = async (event, id) => {
        event.preventDefault();
       
        const formData = new FormData();
        formData.append("contact", new Blob([JSON.stringify(newContact)], { type: "application/json" }));
        if (photoFile) {
            formData.append("photo", photoFile);
        }

        //send a PUT request to the server
        await fetch(`${process.env.REACT_APP_API_URL}/api/contact/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken() // ✅ CSRF Token Add
            },
            credentials: 'include',
            body: formData
        })
        //parse the response
        .then(response => response.json())
        .then(data => {
            setContacts(contacts.map(contact => contact.id === data.id ? data : contact));
            setNewContact(initialNewContactValues);
            setPhotoFile(null);
            toggle();
        }) 
        .catch(error => console.error('Error updating contact:', error));
    }

    // Function to delete contact
    const removeContact = async (event, id) => {
        event.preventDefault();
        if (!window.confirm("Are you sure you want to delete this contact?")) return;
        //send a DELETE request to the server
       try{
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken() // ✅ CSRF Token Add
            },
            credentials: 'include'
        })
        //parse the response
        if (!response.ok) throw new Error("Failed to delete contact");
        fetchContacts();
        }
        catch (error) {
            console.error('Error deleting contact:', error);
        }
    }
       
    
    const ContactCard=({myContact})=>{
        return(
        <Card className="d-flex flex-row shadow-sm border-0 rounded" style={{ maxWidth: "500px", backgroundColor: "#f5f5dc"}} onClick={(event) => toggleAndFetch(event, myContact.id)}>
        {/* Left Section with Image & Badges */}
        <div className="d-flex flex-column align-items-center justify-content-center p-3" style={{ backgroundColor: "#b5c7b3", borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>
          {/* Profile Image */}
          <img
            src={myContact.photoUrl? `${process.env.REACT_APP_API_URL}${myContact.photoUrl}`:"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"}
            alt="Profile"
            className="rounded-circle mb-2"
            style={{ width: "80px", height: "80px", objectFit: "cover", border: "3px solid green" }}
          />
      
          {/* Badges */}
          <Badge color="secondary" className="mb-2">LEVEL {myContact.status}</Badge>
          <Badge color="success">{myContact.title} POINTS</Badge>
        </div>
      
        {/* Right Section with Details */}
        <CardBody style={{ backgroundColor: "white", borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>
          <CardTitle className="h4 fw-bold">{myContact.name}</CardTitle>
          <CardText className="text-muted">
            {myContact.email || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a volutpat mauris."}
          </CardText>
          <small className="text-muted">{myContact.address}</small>
          {/* Buttons */}
            <div className="d-flex justify-content-end align-items-center">
            <Button color="primary" size="sm" className='me-2'>View Profile</Button>
            <Button color="danger" size="sm" onClick={(e)=>{e.stopPropagation(); removeContact(e, myContact.id)}}>Delete</Button>
            </div>
        </CardBody>
          </Card>
        )
    };

    //fetching contacts
    const fetchContacts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contacts`, {
                credentials: 'include'
            });
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            console.error("Error fetching contacts: ", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchContacts();
    }, [setContacts]);

    if (loading) {
        return <p>Fetching Contacts Loading...</p>;
    }

    return (
        <>
        {authenticated ?
        <div className='container'>
        <div className='row' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <h1 style={{ margin: 0, marginRight: 'auto', width:'40%' }}>Contacts Page</h1>
            <Button style={{ width:'10%'}} color="primary" onClick={toggle}>Add Contact</Button>
            {contacts ? (
            <p>{contacts.length > 0 ? (contacts.length === 1 ? `No of Contact: ${contacts.length}` : `No of Contacts: ${contacts.length}`) : ""}</p>
            ) : (
            <p>No contacts available</p>
            )}
        </div>
        <Row className="d-flex justify-content-between mt-4 g-4">
            {contacts===null && contacts===undefined ? (
            "") : (
            contacts.map((contact, index) => (
                <ContactCard key={index} myContact={contact} myContactEditUpdate={myContactEditUpdate} />
            ))
            )}
        </Row>
        

        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} close={<button className="btn-close ms-auto" onClick={handleCancel}></button>}>
                <span>{newContact.id ? 'Update Contact' : 'Add New Contact'}</span>
                 
             </ModalHeader>
            <ModalBody>
            <Form>
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" value={newContact.name} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" name="email" id="email" value={newContact.email} onChange={handleChange} required/>
                </FormGroup>
                <FormGroup>
                    <Label for="title">Title</Label>
                    <Input type="text" name="title" id="title" value={newContact.title} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="status">Status</Label>
                    <Input type="text" name="status" id="status" value={newContact.status} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="address">Address</Label>
                    <Input type="text" name="address" id="address" value={newContact.address} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="photo">Photo (Optional)</Label> 
                    <Input type="file" accept='image/*' id="photoUrl" onChange={handleFileChange} />
                </FormGroup>
            </Form>
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={newContact.id ? (e) => myContactEditUpdate(e, newContact.id) : handleSubmit}>{newContact.id ? 'Update' : 'Submit'}</Button>{' '}
            <Button color="secondary" onClick={handleCancel}>Cancel</Button>
            </ModalFooter>
        </Modal>
        </div>
        :
        <div className='container'>
            <h1>Contacts Page</h1>
            <p>Please login to view your contacts.</p>  
        </div>
        }
        </>

    );
};

    export default Contacts;
        