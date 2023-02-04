import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { OnDragEndResponder } from 'react-beautiful-dnd'

import { Column, getColumns, createColumn, setColumns } from '@/api'

let counter = 0

export default function useColumns() {
  const queryClient = useQueryClient()

  const { isLoading, isError, data, error } = useQuery<Column[], Error>('columns', getColumns)

  const postMutation = useMutation(createColumn, {
    onSuccess: (newColumn) => {
      queryClient.invalidateQueries('columns')
      toast(`${newColumn.name} created.`)
    }
  })

  const setMutation = useMutation(setColumns, {
    onSuccess: () => {
      queryClient.invalidateQueries('columns')
    }
  })

  const addNew = () => {
    counter++

    postMutation.mutate({
      id: counter,
      order: counter,
      name: `Column ${counter}`
    })
  }

  const onDragComplete: OnDragEndResponder = (result) => {
    if (!result.destination) return

    const arr = data ? [...data] : []
    const removedItem = arr.splice(result.source.index, 1)[0]
    arr.splice(result.destination.index, 0, removedItem)

    setMutation.mutate(arr)
  }

  return {
    isLoading,
    isError,
    data,
    error,
    addNew,
    onDragComplete
  }
}
