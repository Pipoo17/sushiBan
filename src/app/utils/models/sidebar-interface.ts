

interface navbarHeader {
    Title: string,
    Icon: string,
}

interface navbarCell {
    ico: string,
    desc: string,
    routing: string,
    adminRestriction?: boolean , //visibile solo agli admin
}

interface navbarFooter{
    adminLabel: string,
    userLabel: string,
}

interface customizations{
    showToolTip?: boolean, //se valorizzato sever per mostrare/nascondere il ToolTip sull' over con il mouse
    showSearchBar?: boolean, //se valorizzato mostra la searchbar(non funziona il filtro sulle voci menu)


}

export interface navbarObject {
    Header:navbarHeader,
    Cells: navbarCell[];
    Footer: navbarFooter,
    Customizations?: customizations
}