const { useState, useEffect } = React
const { useParams } = ReactRouter
const { useSearchParams } = ReactRouterDOM

import { mailService } from "../services/mail.service.js"
import { MailList } from "../cmps/MailList.jsx"
import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailFolderList } from "../cmps/MailFolderList.jsx"
import { showSuccessMsg, showErrorMsg } from "../../../services/event-bus.service.js"
import { MailDetails } from "../pages/MailDetails.jsx"

export function MailIndex() {
    const params = useParams()
    const [isMailCompose, setIsMailCompose] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [mails, setMails] = useState([])
    const [folder, setFolder] = useState({ status: 'inbox' })
    const [filterBy, setFilterBy] = useState(mailService.getFilterFromSearchParams(searchParams))
    const [unreadMailsCount, setUnreadMailsCount] = useState(null)
    const [toggleMenu, setToggleMenu] = useState('')

    useEffect(() => {
        setSearchParams({ ...filterBy, ...folder })
        onSetUnreadMailsCount()
        console.log('test')
        mailService.query({ ...filterBy, ...folder })
        .then((mails) => setMails(mails))
    }, [filterBy, folder, isMailCompose])

    function onSetFilterBy(newFilter) {
        setFilterBy(newFilter)
    }
    
    function onSetFolder(value) {
        setFolder(prevFolder => {
            return ({...prevFolder, status: value })
        })
        setSearchParams({ ...filterBy, status: value })
    }

    function onSetIsMailCompose() {
        setIsMailCompose(false)
    }

    function sendMail(mail) {
        mailService.send(mail)
            .then(() => {
                showSuccessMsg('The mail has been sent successfully!')
            })
            .catch(() => {
                showErrorMsg('The mail could not be send')
            })
    }

    function removeMail(mailId) {
        mailService.remove(mailId)
            .then(() => {
                setMails(prevMails => prevMails.filter(mail => mail.id !== mailId))
                onSetUnreadMailsCount()
                showSuccessMsg('The mail has been removed successfully!')
            })
            .catch(() => {
                showErrorMsg('The mail could not be removed')
            })
    }

    function changeStarMail(mailId) {
        mailService.changeStarMail(mailId)
            .then(() => {
                setMails(prevMails => {
                    const mailIdx = prevMails.findIndex(mail => mail.id === mailId)
                    prevMails[mailIdx].isStared = !prevMails[mailIdx].isStared
                    return [...prevMails]
                })
                showSuccessMsg('The mail has been updated successfully!')
            })
            .catch(() => {
                showErrorMsg('The mail could not be updated')
            })
    }

    function changeMailRead(mailId) {
        mailService.changeMailRead(mailId)
            .then(() => {
                setMails(prevMails => {
                    const mailIdx = prevMails.findIndex(mail => mail.id === mailId)
                    prevMails[mailIdx].isRead = !prevMails[mailIdx].isRead
                    return [...prevMails]
                })
                onSetUnreadMailsCount()
            })
    }

    function onSetUnreadMailsCount() {
        mailService.query({ txt: '', readStatus: 'unread', status: 'inbox' })
            .then((mails) => setUnreadMailsCount(mails.length))
    }

    function onSetToggleMenu(ev, status) {
        ev.stopPropagation()
        status ? setToggleMenu('menu-open') : setToggleMenu('')
    }

    return (
        <section className={`mail-index mail-grid-content ${toggleMenu}`}>
            <header className="mail-grid-sections">
                    <div className="mail-compose-btn">
                        <span onClick={() => setIsMailCompose(true)}><img src="./assets/img/pencil.png"/>Compose</span>
                    </div>
                    <MailFilter folder={folder} filterBy={filterBy} onFilter={onSetFilterBy} onSetToggleMenu={onSetToggleMenu} />
            </header>
            <aside className="mail-grid-sections" onClick={(ev) => onSetToggleMenu(ev, false)}>
                    <MailFolderList folder={folder} onSetFolder={onSetFolder} unreadMailsCount={unreadMailsCount}/>
                    <DynamicCmp isMailCompose={isMailCompose} onSetIsMailCompose={onSetIsMailCompose} 
                    sendMail={sendMail} params={params} mails={mails} onRemoveMail={removeMail} 
                    onChangeStarMail={changeStarMail} onChangeMailRead={changeMailRead} onSetToggleMenu={onSetToggleMenu}/>
            </aside>
        </section>
    )
}

function DynamicCmp(props) {

    if (props.params.mailId) {
        return <MailDetails {...props}/>
    } else {
        return <MailList {...props}/>
    }
}