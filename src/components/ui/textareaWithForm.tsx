import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { filterForUrl } from "@/lib/checkForUrl"

const enum PlaceholderText {
  DEFAULT = "Some random text here...",
  HAS_URL = "It seems you are trying to send a URL. Please remove it to be able to send a message",
  TEXTAREA_DEFAULT = "Begin typing here...",
}

export function TextareaForm() {
  const [placeholder, setPlaceholder] = useState<string>(PlaceholderText.DEFAULT)
  const [stopUserFromSending, setStopUserFromSending] = useState<boolean>(false);

  const verifyTextForUrl = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    if (!content) return;

    if (filterForUrl(content)) {
      setPlaceholder(PlaceholderText.HAS_URL);
      setStopUserFromSending(true);
    } else {
      setPlaceholder(PlaceholderText.DEFAULT);
      setStopUserFromSending(false);
    }
  }

  // TEST
  // console.log(filterForUrl("Random text . com") === true)
  // console.log(filterForUrl("Meet me at here date com") === true)
  // console.log(filterForUrl("Some random url..com") === true)
  // console.log(filterForUrl("I'm out of ideas dot com") === true)
  // console.log(filterForUrl("Tricky dot ocm") === true)
  // console.log(filterForUrl("Heyyy (dot) com") === true)
  // TODO: find a solution for the case below
  // console.log(filterForUrl("Idk WOOSHcom") === true)

  return (
    <>
      <Textarea
        onChange={(e) => verifyTextForUrl(e)} placeholder={PlaceholderText.TEXTAREA_DEFAULT}
        className="resize-none"
      />
      <div>
        {placeholder}
      </div>
      <Button disabled={stopUserFromSending} type="submit">Submit</Button>
    </>
  )
}
