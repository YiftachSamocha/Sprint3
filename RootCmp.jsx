const { Route, Routes } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { AppHeader } from "./cmps/AppHeader.jsx"
import { About } from "./views/About.jsx"
import { Home } from "./views/Home.jsx"
import { MailIndex } from "./apps/mail/views/MailIndex.jsx"
import { NoteIndex } from "./apps/note/views/NoteIndex.jsx"
import { UserMsg } from "./cmps/UserMsg.jsx"
import { MailDetails } from "./apps/mail/pages/MailDetails.jsx"
import { BookIndex } from "./apps/book/views/BookIndex.jsx"
import { BookEdit } from "./apps/book/views/BookEdit.jsx"
import { BookDetails } from "./apps/book/views/BookDetails.jsx"


export function App() {
    return <Router>
        <section className="app">
            <AppHeader />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/mail" element={<MailIndex />}>
                        <Route path="/mail/:mailId" element={<MailDetails />} />
                    </Route>

                    <Route path="/note" element={<NoteIndex />} />

                    <Route path='/book' element={<BookIndex />} />
                    <Route path='/book/edit' element={<BookEdit />} />
                    <Route path='/book/edit/:bookId' element={<BookEdit />} />
                    <Route path='/book/:bookId' element={<BookDetails />} />

                </Routes>
            </main>
            <UserMsg />
        </section>
    </Router>
}