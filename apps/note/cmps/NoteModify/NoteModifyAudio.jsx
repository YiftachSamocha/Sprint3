import { utilService } from "../../../../services/util.service.js"

export function NoteModifyAudio({ info, setInfo }) {


    function handleChange({ target }) {
        const file = target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                const base64String = reader.result
                setInfo({ ...info, audio: base64String })
            }
        }
    }
    return <section className="add-info">
        <input type="file" accept="audio/*"
            onChange={handleChange} id="audio" />
        {info.audio && <audio controls key={utilService.makeId(10)}>
            <source src={info.audio} type="audio/mpeg" />
        </audio>}
    </section>


}