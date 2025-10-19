import { useQuery } from '@/lib/supabase/hooks'
import type { Database } from '@/lib/supabase/database.types'
import { useEffect, useState } from 'react'

type Tables = Database['public']['Tables']
type TableName = keyof Tables
type Row<T extends TableName> = Tables[T]['Row']

interface DataTableProps<T extends TableName> {
  table: T
  columns: Array<{
    key: keyof Row<T>
    header: string
  }>
}

export function DataTable<T extends TableName>({ table, columns }: DataTableProps<T>) {
  const { data, loading: isLoading, error } = useQuery(table, {
    orderBy: 'created_at' as any,
    orderDirection: 'desc'
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key as string}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td
                  key={`${row.id}-${column.key as string}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}