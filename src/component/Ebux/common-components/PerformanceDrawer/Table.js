const Table = ({ header, tableData }) => {
    const handleSorting = (data) => {
        // eslint-disable-next-line no-console
        console.log(data)
    }
    return (
        <>
            <h1 className="mb-3 text-sm font-semibold pl-3">{header}</h1>
            <div className="bg-white max-h-[260px] overflow-y-scroll">
                <table className=" text-left w-full campaignsTable campaignsTable--strips ">
                    <thead>
                        <tr className="bg-[#F7F7F8]">
                            {
                                tableData.header?.map((item, i) => (
                                    <td key={i} className="w-1/6">
                                        <div className="row items-center">
                                            <div>{item.label}</div>
                                            {item?.isSortable && (
                                                <button
                                                    className="sortArrow cursor-pointer ml-4 mr-6 "
                                                    onClick={() => handleSorting(item.isSortable)}
                                                >
                                                    <div
                                                        style={{
                                                            color:
                                                                item.isSortable.order === 1
                                                                    ? "black"
                                                                    : "grey",
                                                        }}
                                                    >
                                                        ▲
                                                    </div>

                                                    <div
                                                        className="downArrow"
                                                        style={{
                                                            color:
                                                                item.isSortable.order === -1
                                                                     ? "black"
                                                                    : "grey",
                                                        }}
                                                    >
                                                        ▼
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody className="[&>*:nth-child(even)]:bg-grey_light [&>*:nth-child(odd)]:bg-white">
                        {
                            tableData.content.map((item,rowi) => {
                                return (
                                        <tr key={rowi}>
                                            {tableData.header?.map((header, i) => {
                                                return (
                                                    <td key={i} className="w-1/6">
                                                        {item[header.value]}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                )
                            })
                        }
                    </tbody>
                    {
                        tableData.footer && <tfoot className="sticky -bottom-[1px] left-0 z-10  flipkarttable__footer">
                            <tr>
                                {tableData.footer.map((item, i) => {
                                    return (
                                        <td key={i} className="w-1/6">
                                            <div>
                                                {item.label}
                                            </div>
                                            <strong>{item.value}</strong>
                                        </td>
                                    )
                                })}
                            </tr>
                        </tfoot>
                    }
                </table>
            </div>
        </>
    )
}

export default Table