import { fixSubminds } from "@/app/actions/admin"
import { Button } from "../ui/button"

export default function FixSubminds() {

    const handleFixSubminds = async () => {
        await fixSubminds()
    }
    return <div>

        <Button onClick={handleFixSubminds}>Fix Subminds</Button>

    </div>
}