import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Ul = styled.ul`
display:flex;
flex-flow: row nowrap;

@media (max-width:768px){
	{
flex-flow : column nowrap;
 background-color: rgba(0,0,0,0.9);
position: fixed;
transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(100%)'};
top:0;
right:0;
height:100vh;
width:300px;
padding-top:3.5rem;
z-index: 11;
transition: transform 0.3s ease-in-out;
}
li a, li i{
	color: #fff;
	font-size:15px;
}
 li {
    padding: 10px;
     border-bottom: 1px solid #403e3e;
}
li:last-child{
	text-align: left;
}
}
`;
const RightNav = ({ open }) => {
    return (
        <Ul open={open}>
            <li><Link to='/Dashboard'><i className="fas fa-home"></i>Dashboard</Link></li>
            <li><Link to='/Myhospital'><i className="far fa-hospital"></i>Myhospital</Link></li>
            <li><Link to='/Contact'><i className="fas fa-phone-alt"></i>Contact Us</Link></li>
            <li><Link to='/splash'><i className="fas fa-user-lock"></i>Logout</Link></li>
        </Ul>
    )

}
export default RightNav;
