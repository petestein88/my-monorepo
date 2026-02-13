import { DataGrid, DataGridProps, gridClasses } from '@mui/x-data-grid'

type IDataTableProps = {} & DataGridProps

const DataTable = (props: IDataTableProps) => {
    return (
        <DataGrid
            autoHeight
            sx={{
                [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                    outline: 'transparent'
                },
                [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
                    outline: 'none'
                }
            }}
            disableColumnMenu
            pageSizeOptions={[10, 25, 50]}
            className='min-h-[100px]'
            style={{
                fontFamily: 'Poppins'
            }}
            rowSelection={false}
            {...props}
            // sortingMode='server'
            sortingMode='client'
            // paginationMode='server'
            paginationMode='client'
        />
    )
}

export default DataTable
