import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { fetchIt } from "../../utils/fetchIt"
import { isStaff } from "../../utils/isStaff"
import { useCondensed } from "./useCondensed"
import { TicketCard } from "./TicketCard"
import "./Tickets.css"

export const TicketList = () => {
    const [active, setActive] = useState("")
    const { toggle, setOriginal, condensed: tickets } = useCondensed({ limit: 40, field: "description" })
    const history = useHistory()
    const [searchTerms, updateSearchTerms] = useState("")

    useEffect(() => {
        fetchIt("http://localhost:8000/tickets")
            .then((tickets) => {
                setOriginal(tickets)
            })
            .catch(() => setOriginal([]))
    }, [])

    useEffect(() => {
        const activeTicketCount = tickets.filter(t => t.date_completed === null).length
        if (isStaff()) {
            setActive(`There are ${activeTicketCount} open tickets`)
        }
        else {
            setActive(`You have ${activeTicketCount} open tickets`)
        }
    }, [tickets])

    const toShowOrNotToShowTheButton = () => {
        if (isStaff()) {
            return ""
        }
        else {
            return <button className="actions__create"
                onClick={() => history.push("/tickets/create")}>Create Ticket</button>
        }
    }

    const filterTickets = (status) => {
        fetchIt(`http://localhost:8000/tickets?status=${status}`)
            .then((tickets) => {
                setOriginal(tickets)
            })
            .catch(() => setOriginal([]))
    }

    const searchTickets = (search) => {
        fetchIt(`http://localhost:8000/tickets?search=${search}`)
            .then((tickets) => {
                setOriginal(tickets)
            })
            .catch(() => setOriginal([]))
    }

    return <>
        <div>
            <button onClick={() => filterTickets("done")}>Show Done</button>
            <button onClick={() => filterTickets("all")}>Show All</button>
            <button onClick={() => filterTickets("unclaimed")}>Show Unclaimed</button>
            <button onClick={() => filterTickets("inprogress")}>Show In Progress</button>
        </div>
        {
            isStaff()
            ?<div>
                <input type={"text"} 
                    placeholder="Search Ticket Descriptions"
                    onChange={(evt) => {
                        const searchTerm = evt.target.value
                        updateSearchTerms(searchTerm)
                    }}
                />
                <button onClick={() => searchTickets(searchTerms)}>Search</button>
            
            </div>
            :""
        }
        <div className="actions">{toShowOrNotToShowTheButton()}</div>
        <div className="activeTickets">{active}</div>
        <article className="tickets">
            { tickets.map(ticket => <TicketCard key={`ticket--${ticket.id}`} ticket={ticket} toggle={toggle} />) }
        </article>
    </>
}
