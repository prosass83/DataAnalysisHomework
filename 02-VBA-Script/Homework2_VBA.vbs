Sub Nasdaq()
  
  For Each ws In Worksheets
        
        'Defining variables
        Dim WorksheetName As String
        Dim YearOpen As Double
        Dim YearClose As Double
        Dim YearlyChange As Double
        Dim PercentChange As Double
        Dim StockVolume As Double
        Dim TickerCounter As Integer
        Dim LastRow As Double
        Dim column As Integer
        
        ' Grabbed the WorksheetName
        WorksheetName = ws.Name
        'Activating current worksheet
        Sheets(WorksheetName).Activate
        ' Set a variable for specifying the column of interest
        column = 1
        'Initializing variables
        TickerCounter = 1
        LastRow = 1
        StockVolume = 0
        YearOpen = 0
        YearClose = 0
        PercentChange = 0

        'Create column names for results
        Range("J1").Value = "Ticker"
        Range("K1").Value = "Yearly Change"
        Range("L1").Value = "Percent Change"
        Range("M1").Value = "Total Stock Volume"
        
        'First Ticker Open Value for the year
        YearOpen = Range("C2").Value
       
        'Determine the Last Row
        LastRow = ws.Cells(Rows.Count, 1).End(xlUp).Row
        'MsgBox (LastRow)
        
        For i = 2 To LastRow

            'Calculating total (accumulated) volume for current ticker 
            StockVolume = StockVolume + Cells(i, 7).Value
            'Finding the opening value of the year for the ticker
            If YearOpen = 0 And Cells(i + 1, 3).Value <> 0 Then
                YearOpen = Cells(i + 1, 3).Value
            End If
            ' Find the last value of the year for the current ticker 
            If Cells(i + 1, column).Value <> Cells(i, column).Value Then
                YearClose = Cells(i, 6).Value
                Cells(TickerCounter + 1, 10).Value = Cells(i, column).Value
                
                'Calculating Yearly Change for the current ticker
                YearlyChange = YearClose - YearOpen
                Cells(TickerCounter + 1, 11).Value = YearlyChange
                
                'Setting the color for the YearlyChange cells
                If YearlyChange < 0 Then
                    Cells(TickerCounter + 1, 11).Interior.ColorIndex = 3
                Else
                    Cells(TickerCounter + 1, 11).Interior.ColorIndex = 4
                End If
                
                'Calculating the Percent Change of the current ticker
                PercentChange = (YearClose / YearOpen) - 1
                
                'Formatting PercentChange Cells
                Cells(TickerCounter + 1, 12).Value = PercentChange
                Cells(TickerCounter + 1, 12).NumberFormat = "0.00%"
                
                'Calculating total volume of the current ticker
                Cells(TickerCounter + 1, 13).Value = StockVolume
                
                'Resetting StockVolume before moving to the next ticker
                StockVolume = 0
                
                'Increasing the ticker counter
                TickerCounter = TickerCounter + 1
            'Message Box the value of the current cell and value of the next cell
            'MsgBox (Cells(i, column).Value & " and then " & Cells(i + 1, column).Value)

            End If

        Next i
       
       'Print message when done with current sheet
       'MsgBox ("Done with " & WorksheetName & " with " & TickerCounter & " tickers!")
    Next ws
  
 
End Sub




