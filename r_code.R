library(ggplot2)
library(lubridate)
library(scales)
library(gridExtra)

rm(list = ls())

setwd("/Users/Michelle/Documents/vergil_wrangle")
zones = list('bj', 'la', 'london', 'moscow', 'vancouver', 'mexico', 'sao_paolo', 'athens', 'baghdad', 'bangkok', 'sydney')

spring2021 = read.csv("spring2021/spring2021_endTimes.csv")
spring2020 = read.csv("spring2020/spring2020_endTimes.csv")
fall2020 = read.csv("fall2020/fall2020_endTimes.csv")

df = spring2021
df$x = as.POSIXct((strptime(spring2021$nyc, "%H:%M",  tz = "UTC")))
ggplot(df) + geom_density( aes(x = x, y = ..scaled..), fill = "red", alpha = 0.5) + scale_x_datetime(labels=date_format("%H:%M"), breaks = "1 hour") + xlab("time") + ggtitle("spring2021_nyc")

spring2021_lec = read.csv("spring2021/spring2021_endTimes_lecture.csv")
spring2021_sem = read.csv("spring2021/spring2021_endTimes_seminar.csv")
spring2021_lab = read.csv("spring2021/spring2021_endTimes_lab.csv")
spring2020_lec = read.csv("spring2020/spring2020_endTimes_lecture.csv")
spring2020_sem = read.csv("spring2020/spring2020_endTimes_seminar.csv")
spring2020_lab = read.csv("spring2020/spring2020_endTimes_lab.csv")

df1 <- spring2020_lab
df2 <- spring2021_lab
df = data.frame(x = c(as.POSIXct(strptime(df1$nyc, "%H:%M",  tz = "UTC")),
                      as.POSIXct(strptime(df2$nyc, "%H:%M",  tz = "UTC"))),
                grp = c(rep("2020", length(df1$nyc)), rep("2021", length(df2$nyc))))
gg <- ggplot(df) + geom_density( aes(x = x, y = ..scaled.., fill = grp), alpha = 0.5)
gg <- gg + scale_x_datetime(labels=date_format("%H:%M"), breaks = "1 hour")
gg <- gg + xlab("time") + ggtitle("spring2020_spring2021_labs")
gg

spring2021 = read.csv("spring2021/spring2021_endTimes.csv")
df = spring2021
df$x = as.POSIXct((strptime(df$nyc, "%H:%M",  tz = "UTC")))
counts <- data.frame(table(cut(df$x, breaks="hour")))
colnames(counts) <- c('time', 'y')
counts$time = as.POSIXct((strptime(counts$time, "%F %H:%M",  tz = "UTC")))
p <- ggplot(counts, aes(x=time, y=y)) + geom_bar(stat="identity") + scale_x_datetime(labels=date_format("%H:%M"), breaks = "1 hour") + ggtitle('nyc')
plots <- list(p)
i = 2
for (tz in zones) {
  df$x = as.POSIXct((strptime(df[[tz]], "%H:%M",  tz = "UTC")))
  tmp <- data.frame(table(cut(df$x, breaks="hour")))$Freq
  if(length(tmp) < 24) {
    tmp <- c(tmp, rep(0, 24-length(tmp)))
  }
  counts$y <- tmp
  p <- ggplot(counts, aes(x=time, y=y)) + geom_bar(stat="identity") + scale_x_datetime(labels=date_format("%H:%M"), breaks = "1 hour") + ggtitle(tz)
  plots[[i]] <- p
  i = i + 1
}

do.call("grid.arrange", plots)