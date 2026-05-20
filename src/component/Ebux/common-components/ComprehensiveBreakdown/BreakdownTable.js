                <tbody>
                  
                            {visibleData && visibleData.map((row, index) => (
                                <tr key={index} className="breakdownRow">
                                    <td className="firstCol sticky" key={`${index}-id`}
                                        style={{
                                            left: stickyColumns?.includes(0)
                                                ? `${columnWidths
                                                    .slice(0, stickyColumns?.indexOf(0))
                                                    .reduce((acc, width) => acc + width, 0)}px`
                                                : undefined,
                                        }}
                                    >
                                        {(headerkey?.[0]?.type == "breakdown" &&
                                            row?.[headerkey?.[0].value] &&
                                            perValue[headerkey?.[0]?.value] != row?.[headerkey?.[0].value])
                                            ?
                                            <input type="checkbox" name="" id=""
                                                checked={isSelectAllChecked || selectedTableRows?.[selectedTabKey]?.some((item) => item?.value === row?.[`${headerkey?.[0].value}_item`]?.value && item?.lable === row?.[`${headerkey?.[0].value}_item`]?.lable)}
                                                onChange={() => handleRowSelect(row?.[`${headerkey?.[0].value}_item`])} />
                                            : <></>}
                                    </td>
                                    {headerkey?.map((header, i) => (renderBodyCol(index, i, header, row)))}
                                </tr>
                            ))}
                            
                            {isLazyLoading && (
                                <tr>
                                    <td
                                        className="p-2 !bg-[#FFF] !max-w-[90vw]"
                                        colSpan={headerkey.length + 1}
                                        rowSpan={3}
                                        style={{ alignItems: "center", verticalAlign: "middle" }}
                                    >
                                        <div className="flex !bg-[#FFF] !justify-center !text-center p-2 row sticky !shadow-none max-w-[90vw]">
                                            <LoaderSpinner />
                                        </div>
                                    </td>
                                </tr>
                            )}
                      
                </tbody>

                {selectedTabName !== "Reviews" && (
                    <tfoot className="dataTableFoot">{renderfootRows()}</tfoot>
                )} 