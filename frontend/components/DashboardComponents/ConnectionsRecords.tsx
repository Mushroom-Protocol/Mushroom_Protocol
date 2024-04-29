import React, { useEffect, useState } from "react"
import { Heading } from "@chakra-ui/react"
import { useCanister } from "@connect2ic/react"

const ConnectionsRecords: React.FC = () => {
  const [backend] = useCanister("backend")
  const [logConnections, setLogConnections] = useState<[any, number[]][]>()

  useEffect(() => {
    const getLogConnections = async () => {
      try {
        const resLogConnections = (await backend.getLogConnections()) as [
          any,
          number[],
        ][]
        setLogConnections(resLogConnections)
      } catch (error) {
        console.error("Error on backend.getLogConnections() call:", error)
      }
    }

    getLogConnections()
  }, [])

  return (
    <>
      <Heading fontSize="4xl" marginBottom="20px">
        Connections records
      </Heading>
      {logConnections?.map((logConnection: any) =>
        JSON.stringify(logConnection),
      )}
    </>
  )
}

export default ConnectionsRecords
