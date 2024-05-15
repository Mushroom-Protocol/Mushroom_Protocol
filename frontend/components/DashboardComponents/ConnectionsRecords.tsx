import React, { useEffect, useState } from "react"
import { Box, Heading, Text } from "@chakra-ui/react"
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
      {logConnections?.map((logConnection: any) => {
        return (
          <Box>
            <Text>{logConnection[0]}</Text>
            <Text>Number of connections: {logConnection[1].length}</Text>
            <Text>
              {JSON.stringify(
                logConnection[1].map((logConnectionTimestamp) =>
                  new Date(
                    parseInt(logConnectionTimestamp) / 1000000,
                  ).toLocaleString(),
                ),
              )}
            </Text>
            <br />
          </Box>
        )
      })}
    </>
  )
}

export default ConnectionsRecords
