library(ggplot2)
library(lubridate)
library(scales)


l = list(bj, la, london, moscow, vancouver, mexico, sao_paolo, athens, baghdad, bangkok, syndey, nyc)

spring2021 = read.csv("C:/Users/Administrator/Desktop/spec/vergil_wrangle/spring2021/spring2021_endTimes.csv")
spring2020 = read.csv("C:/Users/Administrator/Desktop/spec/vergil_wrangle/spring2020/spring2020_endTimes.csv")
fall2020 = read.csv("C:/Users/Administrator/Desktop/spec/vergil_wrangle/fall2020/fall2020_endTimes.csv")

df = spring2021
df$x = as.POSIXct((strptime(spring2021$nyc, "%H:%M",  tz = "UTC")))
ggplot(df) + geom_density( aes(x = x, y = ..scaled..), fill = "red", alpha = 0.5) + scale_x_datetime(labels=date_format("%H:%M"), breaks = "1 hour") + xlab("time") + ggtitle("spring2021_nyc")